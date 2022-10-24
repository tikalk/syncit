---
id: tk1hl
name: Redis functions
file_version: 1.0.2
app_version: 0.9.7-2
file_blobs:
  libs/core/utils/src/lib/redis.ts: a7adee2ea77785ca2fd3c33040d0299d0d180233
---

## `getSessionIdFromUserData`[<sup id="Q8udf">↓</sup>](#f-Q8udf)

This function gets userdata decoded them store them in Redis and return the ID needed to access them

<br/>

1.  create random `sessionID`[<sup id="Z2caqrP">↓</sup>](#f-Z2caqrP) based on uuidv4
    
2.  sets the generated session id as new `redis`[<sup id="BBAvp">↓</sup>](#f-BBAvp) record key.
    
3.  sets the user data as redis record value after `stringify`[<sup id="ZLrQ7r">↓</sup>](#f-ZLrQ7r) and base 64 encoded
    
4.  sets `expiration` time of 24 hours this Redis record
    
5.  return the `sessionID`[<sup id="1RWJcB">↓</sup>](#f-1RWJcB) as string
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 libs/core/utils/src/lib/redis.ts
```typescript
⬜ 5      
⬜ 6      export const redis = new Redis();
⬜ 7      
🟩 8      export const getSessionIdFromUserData = async (userData: User) => {
🟩 9        const sessionID = uuidv4();
🟩 10       await redis.set(
🟩 11         sessionID,
🟩 12         b64Encode(JSON.stringify(userData)),
🟩 13         'EX',
🟩 14         60 * 60 * 24
🟩 15       );
🟩 16       return sessionID as string;
🟩 17     };
⬜ 18     
⬜ 19     export const getUserDataFromSessionId = async (sessionId: string) => {
⬜ 20       const token = await redis.get(sessionId);
```

<br/>

## `getUserDataFromSessionId`[<sup id="Z1JxWaJ">↓</sup>](#f-Z1JxWaJ)

this function expect to get sessionID and return userData fetched from Redis

<br/>

After the service connects to `Redis` it fetches the token from Redis based on the `sessionId`[<sup id="Z1vGBDd">↓</sup>](#f-Z1vGBDd) as key.  
if the `token`[<sup id="2fQhUt">↓</sup>](#f-2fQhUt) is falsy return `false`[<sup id="Zllw2x">↓</sup>](#f-Zllw2x)  
else `b64Decode`[<sup id="1H1Fzf">↓</sup>](#f-1H1Fzf) and `parse`[<sup id="19jAKa">↓</sup>](#f-19jAKa) the data before `return`[<sup id="ZeXUF">↓</sup>](#f-ZeXUF)
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 libs/core/utils/src/lib/redis.ts
```typescript
⬜ 16       return sessionID as string;
⬜ 17     };
⬜ 18     
🟩 19     export const getUserDataFromSessionId = async (sessionId: string) => {
🟩 20       const token = await redis.get(sessionId);
🟩 21       if (!token) {
🟩 22         return false;
🟩 23       }
🟩 24       return JSON.parse(b64Decode(token));
🟩 25     };
⬜ 26     
```

<br/>

<!-- THIS IS AN AUTOGENERATED SECTION. DO NOT EDIT THIS SECTION DIRECTLY -->
### Swimm Note

<span id="f-1H1Fzf">b64Decode</span>[^](#1H1Fzf) - "libs/core/utils/src/lib/redis.ts" L24
```typescript
  return JSON.parse(b64Decode(token));
```

<span id="f-Zllw2x">false</span>[^](#Zllw2x) - "libs/core/utils/src/lib/redis.ts" L22
```typescript
    return false;
```

<span id="f-Q8udf">getSessionIdFromUserData</span>[^](#Q8udf) - "libs/core/utils/src/lib/redis.ts" L8
```typescript
export const getSessionIdFromUserData = async (userData: User) => {
```

<span id="f-Z1JxWaJ">getUserDataFromSessionId</span>[^](#Z1JxWaJ) - "libs/core/utils/src/lib/redis.ts" L19
```typescript
export const getUserDataFromSessionId = async (sessionId: string) => {
```

<span id="f-19jAKa">parse</span>[^](#19jAKa) - "libs/core/utils/src/lib/redis.ts" L24
```typescript
  return JSON.parse(b64Decode(token));
```

<span id="f-BBAvp">redis</span>[^](#BBAvp) - "libs/core/utils/src/lib/redis.ts" L10
```typescript
  await redis.set(
```

<span id="f-ZeXUF">return</span>[^](#ZeXUF) - "libs/core/utils/src/lib/redis.ts" L24
```typescript
  return JSON.parse(b64Decode(token));
```

<span id="f-Z1vGBDd">sessionId</span>[^](#Z1vGBDd) - "libs/core/utils/src/lib/redis.ts" L19
```typescript
export const getUserDataFromSessionId = async (sessionId: string) => {
```

<span id="f-1RWJcB">sessionID</span>[^](#1RWJcB) - "libs/core/utils/src/lib/redis.ts" L16
```typescript
  return sessionID as string;
```

<span id="f-Z2caqrP">sessionID</span>[^](#Z2caqrP) - "libs/core/utils/src/lib/redis.ts" L9
```typescript
  const sessionID = uuidv4();
```

<span id="f-ZLrQ7r">stringify</span>[^](#ZLrQ7r) - "libs/core/utils/src/lib/redis.ts" L12
```typescript
    b64Encode(JSON.stringify(userData)),
```

<span id="f-2fQhUt">token</span>[^](#2fQhUt) - "libs/core/utils/src/lib/redis.ts" L20
```typescript
  const token = await redis.get(sessionId);
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBc3luY2l0JTNBJTNBdGlrYWxr/docs/tk1hl).