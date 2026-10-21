import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
const require = createRequire(import.meta.url);
const checks = [];
function loadTs(path, replacements = {}) {
 const source = fs.readFileSync(path,"utf8");
 const {outputText}=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}});
 const compiledModule={exports:{}};
 new Function("require","module","exports",outputText)((name)=>name in replacements ? replacements[name] : require(name),compiledModule,compiledModule.exports);
 return compiledModule.exports;
}
async function check(name,fn) {await fn(); checks.push({name,passed:true});}
const jwt=loadTs("src/lib/jwt.ts");
const token=(header,payload)=>[header,payload].map(p=>Buffer.from(JSON.stringify(p)).toString("base64url")).concat("signature").join(".");
await check("JWT Unicode object decoding and expiry typing",()=>{
 const parsed=jwt.parseJwt(token({alg:"HS256"},{sub:"开发者",exp:1}));
 assert.equal(parsed.payload.sub,"开发者");assert.equal(jwt.isExpired(parsed.payload),true);
 assert.equal(jwt.isExpired({exp:"1"}),null);assert.equal(jwt.isExpired({exp:Date.now()/1000+3600}),false);
});
await check("Malformed and non-object JWT JSON rejected without render crash",()=>{
 assert.throws(()=>jwt.parseJwt("bad"));assert.throws(()=>jwt.parseJwt(token(null,{})));
 assert.throws(()=>jwt.parseJwt(token({},[])));assert.throws(()=>jwt.parseJwt("%%.%%.sig"));
});
const base64=loadTs("src/lib/base64.ts");
await check("Base64 Unicode and URL-safe round trips",()=>{
 for(const input of ["hello","开发者 😀","\u00ff\u00ff\u00ff"]) for(const safe of [false,true]) assert.equal(base64.decodeBase64ToText(base64.encodeTextToBase64(input,safe)),input);
});
const regexSource=ts.createSourceFile("RegexTesterTool.tsx",fs.readFileSync("src/components/tools/RegexTesterTool.tsx","utf8"),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let regexCallback;
function findMemo(node) {
 if(ts.isVariableDeclaration(node)&&node.name.getText(regexSource).includes("regex, error, matches")&&node.initializer&&ts.isCallExpression(node.initializer)) regexCallback=node.initializer.arguments[0].getText(regexSource);
 ts.forEachChild(node,findMemo);
}
findMemo(regexSource);assert.ok(regexCallback);
const deriveRegex=new Function("pattern","flags","testText","return ("+regexCallback+")();");
await check("Regex global, named capture, invalid syntax and zero-width termination",()=>{
 assert.equal(deriveRegex("(?<name>a)",["g"],"aba").matches.length,2);
 assert.equal(deriveRegex("(?<name>a)",["g"],"aba").matches[0].groups.name,"a");
 assert.equal(deriveRegex("a",[],"aaa").matches.length,1);
 assert.ok(deriveRegex("[",["g"],"aaa").error);
 assert.equal(deriveRegex("(?=)",["g"],"abc").matches.length,4);
 assert.equal(deriveRegex("(?=)",["g","u"],"😀").matches.length,2);
 assert.equal(deriveRegex("a",["g"],"aaa").matches.length,3);
 assert.equal(deriveRegex("a",["g"],"aaa").matches.length,3);
});
let existing=null,writes=[],connections=0,fail=false;
const Subscriber={
 findOne:()=>({lean:async()=>existing}),
 findOneAndUpdate:async(...args)=>{if(fail)throw new Error("private-db-host-and-credentials");writes.push(args);}
};
const route=loadTs("src/app/api/subscribers/route.ts",{
 "@/lib/mongodb":{__esModule:true,default:async()=>{connections++;if(fail)throw new Error("private-db-host-and-credentials")}},
 "@/lib/subscriber":{Subscriber}
});
const request=body=>new Request("http://localhost/api/subscribers",{method:"POST",headers:{"Content-Type":"application/json"},body:typeof body==="string"?body:JSON.stringify(body)});
await check("Newsletter malformed JSON and invalid consent fail before database",async()=>{
 const before=connections;
 for(const body of ["{",{email:"invalid"},{email:"test@example.invalid",blogUpdates:false,promotions:false}]){
  assert.equal((await route.POST(request(body))).status,400);
 }
 assert.equal(connections,before);assert.equal(writes.length,0);
});
await check("Newsletter homepage consent saved and confirmation excludes promotions",async()=>{
 const response=await route.POST(request({email:" TEST@example.invalid ",blogUpdates:true,promotions:false,source:"homepage"}));
 assert.equal(response.status,200);assert.equal((await response.json()).message,"You are subscribed for blog updates.");
 assert.equal(writes[0][1].email,"test@example.invalid");assert.equal(writes[0][1].promotions,false);
 assert.equal(writes[0][1].blogUpdates,true);assert.equal(writes[0][1].source,"homepage");
});
await check("Newsletter duplicate leaves existing preferences unchanged",async()=>{
 existing={email:"test@example.invalid",blogUpdates:false,promotions:true};const count=writes.length;
 const response=await route.POST(request({email:"test@example.invalid",promotions:false}));
 assert.equal((await response.json()).alreadySubscribed,true);assert.equal(writes.length,count);existing=null;
});
await check("Newsletter promotions-only and combined confirmations match consent",async()=>{
 for(const blogUpdates of [false,true]){
  const response=await route.POST(request({email:"test@example.invalid",blogUpdates,promotions:true}));
  const result=await response.json();assert.equal(result.message,blogUpdates?"You are subscribed for blog updates and promotions.":"You are subscribed for promotions.");
 }
});
await check("Newsletter database failure is generic and retryable",async()=>{
 fail=true;const response=await route.POST(request({email:"test@example.invalid"}));const text=await response.text();
 assert.equal(response.status,500);assert.ok(!text.includes("private-db"));fail=false;
});
const result={checkedAt:new Date().toISOString(),checks,limitations:"Isolated module tests. Newsletter database is mocked: no subscriber, email or production record was created. Regex tests invoke the actual pure memo derivation, not browser rendering. These tests do not verify the five draft guide solutions."};
fs.writeFileSync("reports/recovery-functional-tests.json",JSON.stringify(result,null,2));
console.log(checks.length+" isolated functional checks passed; no database writes.");
