---
id: soekm
name: User middleware
file_version: 1.0.2
app_version: 0.9.7-2
file_blobs:
  libs/core/nest-lib/src/lib/user.data.middleware.ts: 0416d2276dccbe237e0178076cc2666154c5d726
---

This middleware inject `userData`[<sup id="1hPJuh">↓</sup>](#f-1hPJuh) to the response `locals`[<sup id="2f2R7N">↓</sup>](#f-2f2R7N).  
The `userData`[<sup id="1hPJuh">↓</sup>](#f-1hPJuh) is taken from `getUserDataFromSessionId`[<sup id="1VinF8">↓</sup>](#f-1VinF8)
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 libs/core/nest-lib/src/lib/user.data.middleware.ts
```typescript
⬜ 3      import { getUserDataFromSessionId } from '@syncit2.0/core/utils';
⬜ 4      // other imports
⬜ 5      
🟩 6      @Injectable()
🟩 7      export class UserDataMiddleware implements NestMiddleware {
🟩 8        async use(req: Request, res: Response, next: NextFunction) {
🟩 9          const userData = await getUserDataFromSessionId(req.cookies.sessionID);
🟩 10         res.locals.userData = userData;
🟩 11         next();
🟩 12       }
🟩 13     }
⬜ 14     
```

<br/>

[Redis functions](redis-functions.tk1hl.sw.md)

<br/>

<!-- THIS IS AN AUTOGENERATED SECTION. DO NOT EDIT THIS SECTION DIRECTLY -->
### Swimm Note

<span id="f-1VinF8">getUserDataFromSessionId</span>[^](#1VinF8) - "libs/core/nest-lib/src/lib/user.data.middleware.ts" L3
```typescript
import { getUserDataFromSessionId } from '@syncit2.0/core/utils';
```

<span id="f-2f2R7N">locals</span>[^](#2f2R7N) - "libs/core/nest-lib/src/lib/user.data.middleware.ts" L10
```typescript
    res.locals.userData = userData;
```

<span id="f-1hPJuh">userData</span>[^](#1hPJuh) - "libs/core/nest-lib/src/lib/user.data.middleware.ts" L9
```typescript
    const userData = await getUserDataFromSessionId(req.cookies.sessionID);
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBc3luY2l0JTNBJTNBdGlrYWxr/docs/soekm).