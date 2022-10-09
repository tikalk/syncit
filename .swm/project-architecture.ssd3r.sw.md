---
id: ssd3r
name: Project Architecture
file_version: 1.0.2
app_version: 0.9.7-1
file_blobs:
  apps/be/src/app/auth/auth.controller.ts: f3c582f76d0b51730ee7343065061d04c9d9515d
  apps/be/src/app/auth/auth.service.ts: 83c0a82897969e503c004c6153622feb8c2c3f55
---

We make it easy to sync your calendars in real time.

# This is the current main architecture

<br/>

<div align="center"><img src="https://firebasestorage.googleapis.com/v0/b/swimmio-content/o/repositories%2FZ2l0aHViJTNBJTNBc3luY2l0JTNBJTNBdGlrYWxr%2F7f892c05-142e-4a02-a01d-22c368dd2c05.png?alt=media&token=ee5958b1-49ff-4544-a558-b911add38aba" style="width:'100%'"/></div>

<br/>

## Auth architecture

Auth microservice has 4 Endpoints:

<br/>

available via `/api/auth`
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/be/src/app/auth/auth.controller.ts
```typescript
⬜ 2      
⬜ 3      import { AuthService } from './auth.service';
⬜ 4      
🟩 5      @Controller('auth')
⬜ 6      export class AuthController {
⬜ 7        constructor(private readonly authService: AuthService) {}
⬜ 8      
```

<br/>

### Register \[POST\]




<br/>



<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/be/src/app/auth/auth.controller.ts
```typescript
⬜ 6      export class AuthController {
⬜ 7        constructor(private readonly authService: AuthService) {}
⬜ 8      
🟩 9        @Post('register')
🟩 10       async register(@Req() request: Request, @Res() response: Response) {
🟩 11         return this.authService.register(request, response);
🟩 12       }
⬜ 13     
⬜ 14       @Post('login')
⬜ 15       async login(@Req() request: Request, @Res() response: Response) {
```

<br/>

1.  Get `name`[<sup id="1nQkij">↓</sup>](#f-1nQkij)`,` `email`[<sup id="ZRiw8v">↓</sup>](#f-ZRiw8v) `&` `password`[<sup id="28xCQo">↓</sup>](#f-28xCQo)as params.
    
2.  Check if `name`[<sup id="Z2vSiQn">↓</sup>](#f-Z2vSiQn) exist if not return 422 status.
    
3.  check if `userEmail`[<sup id="14vXKT">↓</sup>](#f-14vXKT) that is `email`[<sup id="ZttGfq">↓</sup>](#f-ZttGfq) lowerdcase exist in contain '@' if not return 422 status.
    
4.  check if `password`[<sup id="9Iyxn">↓</sup>](#f-9Iyxn) exist and it's length is bigger than 7 if not return 422 status
    
5.  checking if user exist be quey the DB an look for user with the email given.
    
6.  if `existingUser`[<sup id="ZwKLDq">↓</sup>](#f-ZwKLDq)return 409 status.
    
7.  hasing the password `hashedPassword`[<sup id="Zb4irV">↓</sup>](#f-Zb4irV)
    
8.  upsert new user in the DB & look that it coorectly inserted by fetcing it.
    
9.  remove the password from `newUser`[<sup id="r8MDS">↓</sup>](#f-r8MDS)
    
10.  getting `sessionID`[<sup id="ZTUQO">↓</sup>](#f-ZTUQO) from user data.
    
11.  setting cookie and returnig it to the client.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/be/src/app/auth/auth.service.ts
```typescript
⬜ 61         res.status(401).json({ message: 'Unauthorized' });
⬜ 62       }
⬜ 63     
🟩 64       async register(req, res) {
🟩 65         const { name, email, password } = req.body;
🟩 66         const userEmail = email?.toLowerCase();
🟩 67     
🟩 68         if (!name) {
🟩 69           res.status(422).json({ message: 'Invalid name' });
🟩 70           return;
🟩 71         }
🟩 72     
🟩 73         if (!userEmail || !userEmail.includes('@')) {
🟩 74           res.status(422).json({ message: 'Invalid email' });
🟩 75           return;
🟩 76         }
🟩 77     
🟩 78         if (!password || password.trim().length < 7) {
🟩 79           res.status(422).json({
🟩 80             message:
🟩 81               'Invalid input - password should be at least 7 characters long.',
🟩 82           });
🟩 83           return;
🟩 84         }
🟩 85     
🟩 86         const existingUser = await prisma.user.findFirst({
🟩 87           where: {
🟩 88             email: userEmail,
🟩 89           },
🟩 90         });
🟩 91     
🟩 92         if (existingUser) {
🟩 93           const message = 'Email address is already registered';
🟩 94     
🟩 95           res.status(409).json({ message });
🟩 96           return;
🟩 97         }
🟩 98     
🟩 99         const hashedPassword = await hashPassword(password);
🟩 100    
🟩 101        await prisma.user.upsert({
🟩 102          where: { email: userEmail },
🟩 103          update: {
🟩 104            name,
🟩 105            email: userEmail,
🟩 106            password: hashedPassword,
🟩 107            created: new Date(Date.now()),
🟩 108          },
🟩 109          create: {
🟩 110            name,
🟩 111            email: userEmail,
🟩 112            password: hashedPassword,
🟩 113            created: new Date(Date.now()),
🟩 114          },
🟩 115        });
🟩 116        const newUser = await prisma.user.findFirst({
🟩 117          where: {
🟩 118            email: userEmail,
🟩 119          },
🟩 120        });
🟩 121        delete newUser.password;
🟩 122        const sessionID = await getSessionIdFromUserData(existingUser);
🟩 123        setCookie(res, 'sessionID', sessionID, {
🟩 124          maxAge: 1000 * 60 * 60,
🟩 125          path: '/',
🟩 126          httpOnly: true,
🟩 127        });
🟩 128        res.setHeader('Access-Control-Allow-Credentials', 'true');
🟩 129        res.end(res.getHeader('Set-Cookie'));
🟩 130      }
⬜ 131    
⬜ 132      async me(req, res) {
⬜ 133        const { userData } = res.locals;
```

<br/>

### login \[POST\]




<br/>



<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/be/src/app/auth/auth.controller.ts
```typescript
⬜ 11         return this.authService.register(request, response);
⬜ 12       }
⬜ 13     
🟩 14       @Post('login')
🟩 15       async login(@Req() request: Request, @Res() response: Response) {
🟩 16         return this.authService.login(request, response);
🟩 17       }
⬜ 18       @Post('logout')
⬜ 19       async logout(@Req() request: Request, @Res() response: Response) {
⬜ 20         return this.authService.logout(request, response);
```

<br/>

1.  get `email`[<sup id="1ynt6F">↓</sup>](#f-1ynt6F) `&` `password`[<sup id="ZuWuHm">↓</sup>](#f-ZuWuHm)
    
2.  convert to email to lowerdcase `userEmail`[<sup id="Z2ksdYh">↓</sup>](#f-Z2ksdYh) to prevent userbased errors.
    
3.  check if `userEmail`[<sup id="Z1xOyd7">↓</sup>](#f-Z1xOyd7) exist in include '@' if not return 422 status.
    
4.  check if `password`[<sup id="Dkom9">↓</sup>](#f-Dkom9) exist in thength is bigger than 7 if not return 422 status.
    
5.  getting the `existingUser`[<sup id="ZpOb80">↓</sup>](#f-ZpOb80) from the DB based on the email.
    
6.  if `existingUser`[<sup id="1wfYip">↓</sup>](#f-1wfYip) do a one side password verification and put in `verified`[<sup id="Z1LK822">↓</sup>](#f-Z1LK822)
    
7.  if `verified`[<sup id="Z1nVi8W">↓</sup>](#f-Z1nVi8W) delete the password from the user doc.
    
8.  getting `sessionID`[<sup id="Z2r8wDt">↓</sup>](#f-Z2r8wDt) from user data.
    
9.  setting cookie and returnig it to the client.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/be/src/app/auth/auth.service.ts
```typescript
⬜ 21         res.end(res.getHeader('Set-Cookie'));
⬜ 22       }
⬜ 23     
🟩 24       async login(req, res) {
🟩 25         const { email, password } = req.body;
🟩 26         const userEmail = email?.toLowerCase();
🟩 27     
🟩 28         if (!userEmail || !userEmail.includes('@')) {
🟩 29           res.status(422).json({ message: 'Invalid email' });
🟩 30           return;
🟩 31         }
🟩 32     
🟩 33         if (!password || password.trim().length < 7) {
🟩 34           res.status(422).json({
🟩 35             message:
🟩 36               'Invalid input - password should be at least 7 characters long.',
🟩 37           });
🟩 38           return;
🟩 39         }
🟩 40     
🟩 41         const existingUser = await prisma.user.findFirst({
🟩 42           where: {
🟩 43             email: userEmail,
🟩 44           },
🟩 45         });
🟩 46         if (existingUser) {
🟩 47           const verified = await verifyPassword(password, existingUser.password);
🟩 48           if (verified) {
🟩 49             delete existingUser.password;
🟩 50             const sessionID = await getSessionIdFromUserData(existingUser);
🟩 51             setCookie(res, 'sessionID', sessionID, {
🟩 52               maxAge: 1000 * 60 * 60,
🟩 53               path: '/',
🟩 54               httpOnly: true,
🟩 55             });
🟩 56             res.setHeader('Access-Control-Allow-Credentials', 'true');
🟩 57             res.end(res.getHeader('Set-Cookie'));
🟩 58             return;
🟩 59           }
🟩 60         }
🟩 61         res.status(401).json({ message: 'Unauthorized' });
🟩 62       }
⬜ 63     
⬜ 64       async register(req, res) {
⬜ 65         const { name, email, password } = req.body;
```

<br/>

### logout \[POST\]




<br/>



<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/be/src/app/auth/auth.controller.ts
```typescript
⬜ 15       async login(@Req() request: Request, @Res() response: Response) {
⬜ 16         return this.authService.login(request, response);
⬜ 17       }
🟩 18       @Post('logout')
🟩 19       async logout(@Req() request: Request, @Res() response: Response) {
🟩 20         return this.authService.logout(request, response);
🟩 21       }
⬜ 22     
⬜ 23       @Get('me')
⬜ 24       async me(@Req() request: Request, @Res() response: Response) {
```

<br/>

1.  set `sessionID`[<sup id="1VCD27">↓</sup>](#f-1VCD27) cookie value to 0 & max age to '-1' and send it to the client to delete from his browser
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/be/src/app/auth/auth.service.ts
```typescript
⬜ 11     
⬜ 12     @Injectable()
⬜ 13     export class AuthService {
🟩 14       async logout(req, res) {
🟩 15         setCookie(res, 'sessionID', 0, {
🟩 16           maxAge: -1,
🟩 17           path: '/',
🟩 18           httpOnly: true,
🟩 19         });
🟩 20         res.setHeader('Access-Control-Allow-Credentials', 'true');
🟩 21         res.end(res.getHeader('Set-Cookie'));
🟩 22       }
⬜ 23     
⬜ 24       async login(req, res) {
⬜ 25         const { email, password } = req.body;
```

<br/>

### me \[GET\]




<br/>



<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/be/src/app/auth/auth.controller.ts
```typescript
⬜ 20         return this.authService.logout(request, response);
⬜ 21       }
⬜ 22     
🟩 23       @Get('me')
🟩 24       async me(@Req() request: Request, @Res() response: Response) {
🟩 25         return this.authService.me(request, response);
🟩 26       }
⬜ 27     }
⬜ 28     
```

<br/>

1.  get `userData`[<sup id="ZOgodO">↓</sup>](#f-ZOgodO) from the response.
    
2.  check if `id`[<sup id="1VlHEc">↓</sup>](#f-1VlHEc) exist if it's exist return the userData as JSON.
    
3.  if not return 401 to the client (in order to be redirected there to logout)
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/be/src/app/auth/auth.service.ts
```typescript
⬜ 129        res.end(res.getHeader('Set-Cookie'));
⬜ 130      }
⬜ 131    
🟩 132      async me(req, res) {
🟩 133        const { userData } = res.locals;
🟩 134        if (userData?.id) {
🟩 135          res.json({ userData });
🟩 136          return;
🟩 137        }
🟩 138        res.status(401).send('unauthorized');
🟩 139      }
⬜ 140    }
⬜ 141    
```

<br/>

<!-- THIS IS AN AUTOGENERATED SECTION. DO NOT EDIT THIS SECTION DIRECTLY -->
### Swimm Note

<span id="f-1ynt6F">email</span>[^](#1ynt6F) - "apps/be/src/app/auth/auth.service.ts" L25
```typescript
    const { email, password } = req.body;
```

<span id="f-ZttGfq">email</span>[^](#ZttGfq) - "apps/be/src/app/auth/auth.service.ts" L66
```typescript
    const userEmail = email?.toLowerCase();
```

<span id="f-ZRiw8v">email</span>[^](#ZRiw8v) - "apps/be/src/app/auth/auth.service.ts" L65
```typescript
    const { name, email, password } = req.body;
```

<span id="f-1wfYip">existingUser</span>[^](#1wfYip) - "apps/be/src/app/auth/auth.service.ts" L46
```typescript
    if (existingUser) {
```

<span id="f-ZpOb80">existingUser</span>[^](#ZpOb80) - "apps/be/src/app/auth/auth.service.ts" L41
```typescript
    const existingUser = await prisma.user.findFirst({
```

<span id="f-ZwKLDq">existingUser</span>[^](#ZwKLDq) - "apps/be/src/app/auth/auth.service.ts" L92
```typescript
    if (existingUser) {
```

<span id="f-Zb4irV">hashedPassword</span>[^](#Zb4irV) - "apps/be/src/app/auth/auth.service.ts" L99
```typescript
    const hashedPassword = await hashPassword(password);
```

<span id="f-1VlHEc">id</span>[^](#1VlHEc) - "apps/be/src/app/auth/auth.service.ts" L134
```typescript
    if (userData?.id) {
```

<span id="f-Z2vSiQn">name</span>[^](#Z2vSiQn) - "apps/be/src/app/auth/auth.service.ts" L68
```typescript
    if (!name) {
```

<span id="f-1nQkij">name</span>[^](#1nQkij) - "apps/be/src/app/auth/auth.service.ts" L65
```typescript
    const { name, email, password } = req.body;
```

<span id="f-r8MDS">newUser</span>[^](#r8MDS) - "apps/be/src/app/auth/auth.service.ts" L121
```typescript
    delete newUser.password;
```

<span id="f-Dkom9">password</span>[^](#Dkom9) - "apps/be/src/app/auth/auth.service.ts" L33
```typescript
    if (!password || password.trim().length < 7) {
```

<span id="f-ZuWuHm">password</span>[^](#ZuWuHm) - "apps/be/src/app/auth/auth.service.ts" L25
```typescript
    const { email, password } = req.body;
```

<span id="f-9Iyxn">password</span>[^](#9Iyxn) - "apps/be/src/app/auth/auth.service.ts" L78
```typescript
    if (!password || password.trim().length < 7) {
```

<span id="f-28xCQo">password</span>[^](#28xCQo) - "apps/be/src/app/auth/auth.service.ts" L65
```typescript
    const { name, email, password } = req.body;
```

<span id="f-1VCD27">sessionID</span>[^](#1VCD27) - "apps/be/src/app/auth/auth.service.ts" L15
```typescript
    setCookie(res, 'sessionID', 0, {
```

<span id="f-Z2r8wDt">sessionID</span>[^](#Z2r8wDt) - "apps/be/src/app/auth/auth.service.ts" L50
```typescript
        const sessionID = await getSessionIdFromUserData(existingUser);
```

<span id="f-ZTUQO">sessionID</span>[^](#ZTUQO) - "apps/be/src/app/auth/auth.service.ts" L122
```typescript
    const sessionID = await getSessionIdFromUserData(existingUser);
```

<span id="f-ZOgodO">userData</span>[^](#ZOgodO) - "apps/be/src/app/auth/auth.service.ts" L133
```typescript
    const { userData } = res.locals;
```

<span id="f-Z1xOyd7">userEmail</span>[^](#Z1xOyd7) - "apps/be/src/app/auth/auth.service.ts" L28
```typescript
    if (!userEmail || !userEmail.includes('@')) {
```

<span id="f-Z2ksdYh">userEmail</span>[^](#Z2ksdYh) - "apps/be/src/app/auth/auth.service.ts" L26
```typescript
    const userEmail = email?.toLowerCase();
```

<span id="f-14vXKT">userEmail</span>[^](#14vXKT) - "apps/be/src/app/auth/auth.service.ts" L73
```typescript
    if (!userEmail || !userEmail.includes('@')) {
```

<span id="f-Z1nVi8W">verified</span>[^](#Z1nVi8W) - "apps/be/src/app/auth/auth.service.ts" L48
```typescript
      if (verified) {
```

<span id="f-Z1LK822">verified</span>[^](#Z1LK822) - "apps/be/src/app/auth/auth.service.ts" L47
```typescript
      const verified = await verifyPassword(password, existingUser.password);
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBc3luY2l0JTNBJTNBdGlrYWxr/docs/ssd3r).