---
id: nd95a
name: Auth Microservice
file_version: 1.0.2
app_version: 0.9.7-2
file_blobs:
  apps/microservices/auth/src/app/auth.controller.ts: 5d671599071f779fc89b51bf5c9de48fb2dfce51
  apps/microservices/auth/src/app/auth.service.ts: 83c0a82897969e503c004c6153622feb8c2c3f55
---

Auth microservice has 4 Endpoints:

<br/>

available via `/api/auth`
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/microservices/auth/src/app/auth.controller.ts
```typescript
⬜ 5      
⬜ 6      import { AuthService } from './auth.service';
⬜ 7      
🟩 8      @Controller('auth')
⬜ 9      export class AuthController {
⬜ 10       constructor(private readonly authService: AuthService) {}
⬜ 11     
```

<br/>

### Register \[POST\]




<br/>



<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/microservices/auth/src/app/auth.controller.ts
```typescript
⬜ 9      export class AuthController {
⬜ 10       constructor(private readonly authService: AuthService) {}
⬜ 11     
🟩 12       @Post('register')
🟩 13       async register(@Req() request: Request, @Res() response: Response) {
🟩 14         return this.authService.register(request, response);
🟩 15       }
⬜ 16     
⬜ 17       @Post('login')
⬜ 18       async login(@Req() request: Request, @Res() response: Response) {
```

<br/>

1.  Get [[sym-text:name(6c79d660-f847-4e3e-9bdc-a0da712e5cb9)]]`,` [[sym-text:email(6303e725-838b-4aa5-9178-becb51c1ce78)]] `&` [[sym-text:password(6950c213-3b77-433b-8b5d-4a2e013a3a50)]]as params.
    
2.  Check if [[sym-text:name(62bcfeab-bf62-44fc-9b7d-ee336d305641)]] exist if not return 422 status.
    
3.  check if [[sym-text:userEmail(ba4894be-7947-40e4-ab95-659f14eb7eac)]] that is [[sym-text:email(ba760c15-904b-4c7a-ba8b-386068e4eb40)]] lowerdcase exist in contain '@' if not return 422 status.
    
4.  check if [[sym-text:password(dde35dc6-a713-4532-991c-19bd3d7d2fe9)]] exist and it's length is bigger than 7 if not return 422 status
    
5.  checking if user exist be quey the DB an look for user with the email given.
    
6.  if [[sym-text:existingUser(24689d73-f225-4bc1-b3c4-4657b5b8dc8d)]]return 409 status.
    
7.  hasing the password [[sym-text:hashedPassword(e8cb9592-ea3b-40bf-97b3-230bcbe250f8)]]
    
8.  upsert new user in the DB & look that it coorectly inserted by fetcing it.
    
9.  remove the password from [[sym-text:newUser(61752268-2f13-4e00-a407-be989b960b46)]]
    
10.  getting [[sym-text:sessionID(23a363df-d495-4dae-94f4-b9856d6bae94)]] from user data.
    
11.  setting cookie and returnig it to the client.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/microservices/auth/src/app/auth.service.ts
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
### 📄 apps/microservices/auth/src/app/auth.controller.ts
```typescript
⬜ 14         return this.authService.register(request, response);
⬜ 15       }
⬜ 16     
🟩 17       @Post('login')
🟩 18       async login(@Req() request: Request, @Res() response: Response) {
🟩 19         return this.authService.login(request, response);
🟩 20       }
⬜ 21       @Post('logout')
⬜ 22       async logout(@Req() request: Request, @Res() response: Response) {
⬜ 23         return this.authService.logout(request, response);
```

<br/>

1.  get [[sym-text:email(dd6b4104-12b6-4e9a-b373-8919d951e0dd)]] `&` [[sym-text:password(94767fc1-d22e-461a-9864-d5462727ff87)]]
    
2.  convert to email to lowerdcase [[sym-text:userEmail(55cbc06b-5b74-4ec5-90c7-37cfe41a032c)]] to prevent userbased errors.
    
3.  check if [[sym-text:userEmail(a3243d61-d917-4653-b790-3c68a330d8c2)]] exist in include '@' if not return 422 status.
    
4.  check if [[sym-text:password(0ade5b4c-dae2-448f-a483-66aa0ffeb94b)]] exist in thength is bigger than 7 if not return 422 status.
    
5.  getting the [[sym-text:existingUser(01351283-db7a-409b-a331-55f0c416949a)]] from the DB based on the email.
    
6.  if [[sym-text:existingUser(4b0fef13-c7e4-456e-8502-9b0e0451b124)]] do a one side password verification and put in [[sym-text:verified(7b8b91bf-6a59-44fd-b4d1-9c4a7cb3271d)]]
    
7.  if [[sym-text:verified(78799129-3c85-43f0-b0b1-2a273ecd4525)]] delete the password from the user doc.
    
8.  getting [[sym-text:sessionID(19bb2953-0b46-412e-b9bc-6fff87a12389)]] from user data.
    
9.  setting cookie and returnig it to the client.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/microservices/auth/src/app/auth.service.ts
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
### 📄 apps/microservices/auth/src/app/auth.controller.ts
```typescript
⬜ 18       async login(@Req() request: Request, @Res() response: Response) {
⬜ 19         return this.authService.login(request, response);
⬜ 20       }
🟩 21       @Post('logout')
🟩 22       async logout(@Req() request: Request, @Res() response: Response) {
🟩 23         return this.authService.logout(request, response);
🟩 24       }
⬜ 25     
⬜ 26       @Get('me')
⬜ 27       async me(@Req() request: Request, @Res() response: Response) {
```

<br/>

1.  set [[sym-text:sessionID(325358ab-0229-43d9-b1a3-1997afdb1792)]] cookie value to 0 & max age to '-1' and send it to the client to delete from his browser
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/microservices/auth/src/app/auth.service.ts
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
### 📄 apps/microservices/auth/src/app/auth.controller.ts
```typescript
⬜ 23         return this.authService.logout(request, response);
⬜ 24       }
⬜ 25     
🟩 26       @Get('me')
🟩 27       async me(@Req() request: Request, @Res() response: Response) {
🟩 28         return this.authService.me(request, response);
🟩 29       }
⬜ 30     }
```

<br/>

1.  get [[sym-text:userData(d7f97296-4593-4a79-a739-42bbec95f1f9)]] from the response.
    
2.  check if [[sym-text:id(d8d30c50-97dd-4b7c-b744-9008066822a7)]] exist if it's exist return the userData as JSON.
    
3.  if not return 401 to the client (in order to be redirected there to logout)
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/microservices/auth/src/app/auth.service.ts
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

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBc3luY2l0JTNBJTNBdGlrYWxr/docs/nd95a).