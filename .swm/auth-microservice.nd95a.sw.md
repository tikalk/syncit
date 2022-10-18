---
id: nd95a
name: Auth Microservice
file_version: 1.0.2
app_version: 0.9.7-2
file_blobs:
  apps/microservices/auth/src/app/auth.controller.ts: d685b922ac52b4eb77ec5e8a8e53e870a3f7ec96
  apps/microservices/auth/src/app/auth.service.ts: 8cb706074be87ee50fc48421d0381436e9629bda
---

Auth microservice has 4 Endpoints:

<br/>

available via `/api/auth`
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/microservices/auth/src/app/auth.controller.ts
```typescript
⬜ 22     import { LoginInput, RegisterInput, UserData } from './auth.dto';
⬜ 23     
⬜ 24     @ApiTags('Auth')
🟩 25     @Controller('auth')
⬜ 26     export class AuthController {
⬜ 27       constructor(private readonly authService: AuthService) {}
⬜ 28     
```

<br/>

### Register \[POST\]




<br/>



<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/microservices/auth/src/app/auth.controller.ts
```typescript
⬜ 26     export class AuthController {
⬜ 27       constructor(private readonly authService: AuthService) {}
⬜ 28     
🟩 29       @Post('register')
🟩 30       @ApiBody({
🟩 31         description: 'Registration params',
🟩 32         type: RegisterInput,
🟩 33       })
🟩 34       @ApiCreatedResponse({
🟩 35         description: 'User registered successfully and cookie saved on initiator.',
🟩 36         type: RegisterInput,
🟩 37       })
🟩 38       @ApiUnprocessableEntityResponse({
🟩 39         description: 'Error with the data sent.',
🟩 40       })
🟩 41       @ApiConflictResponse({
🟩 42         description: 'User (email) already exist.',
🟩 43       })
🟩 44       async register(@Req() request: Request, @Res() response: Response) {
🟩 45         return this.authService.register(request, response);
🟩 46       }
⬜ 47     
⬜ 48       @Post('login')
⬜ 49       @ApiBody({
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
⬜ 60         res.status(401).json({ message: 'Unauthorized' });
⬜ 61       }
⬜ 62     
🟩 63       async register(req, res) {
🟩 64         const { name, email, password } = req.body;
🟩 65         const userEmail = email?.toLowerCase();
🟩 66     
🟩 67         if (!name) {
🟩 68           res.status(422).json({ message: 'Invalid name' });
🟩 69           return;
🟩 70         }
🟩 71     
🟩 72         if (!userEmail || !userEmail.includes('@')) {
🟩 73           res.status(422).json({ message: 'Invalid email' });
🟩 74           return;
🟩 75         }
🟩 76     
🟩 77         if (!password || password.trim().length < 7) {
🟩 78           res.status(422).json({
🟩 79             message:
🟩 80               'Invalid input - password should be at least 7 characters long.',
🟩 81           });
🟩 82           return;
🟩 83         }
🟩 84     
🟩 85         const existingUser = await prisma.user.findFirst({
🟩 86           where: {
🟩 87             email: userEmail,
🟩 88           },
🟩 89         });
🟩 90     
🟩 91         if (existingUser) {
🟩 92           const message = 'Email address is already registered';
🟩 93     
🟩 94           res.status(409).json({ message });
🟩 95           return;
🟩 96         }
🟩 97     
🟩 98         const hashedPassword = await hashPassword(password);
🟩 99     
🟩 100        await prisma.user.upsert({
🟩 101          where: { email: userEmail },
🟩 102          update: {
🟩 103            name,
🟩 104            email: userEmail,
🟩 105            password: hashedPassword,
🟩 106            created: new Date(Date.now()),
🟩 107          },
🟩 108          create: {
🟩 109            name,
🟩 110            email: userEmail,
🟩 111            password: hashedPassword,
🟩 112            created: new Date(Date.now()),
🟩 113          },
🟩 114        });
🟩 115        const newUser = await prisma.user.findFirst({
🟩 116          where: {
🟩 117            email: userEmail,
🟩 118          },
🟩 119        });
🟩 120        delete newUser.password;
🟩 121        const sessionID = await getSessionIdFromUserData(existingUser);
🟩 122        setCookie(res, 'sessionID', sessionID, {
🟩 123          maxAge: 1000 * 60 * 60,
🟩 124          path: '/',
🟩 125          httpOnly: true,
🟩 126        });
🟩 127        res.setHeader('Access-Control-Allow-Credentials', 'true');
🟩 128        res.status(201).end(res.getHeader('Set-Cookie'));
🟩 129      }
⬜ 130    
⬜ 131      async me(req, res) {
⬜ 132        const { userData } = res.locals;
```

<br/>

### login \[POST\]




<br/>



<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/microservices/auth/src/app/auth.controller.ts
```typescript
⬜ 45         return this.authService.register(request, response);
⬜ 46       }
⬜ 47     
🟩 48       @Post('login')
🟩 49       @ApiBody({
🟩 50         description: 'Login params',
🟩 51         type: LoginInput,
🟩 52       })
🟩 53       @ApiOkResponse({
🟩 54         description: 'User logged in successfully and cookie saved on initiator.',
🟩 55       })
🟩 56       @ApiUnprocessableEntityResponse({
🟩 57         description: 'Error with the data sent.',
🟩 58       })
🟩 59       @ApiUnauthorizedResponse({
🟩 60         description: 'Error with the data sent. Unauthorized',
🟩 61       })
🟩 62       async login(@Req() request: Request, @Res() response: Response) {
🟩 63         return this.authService.login(request, response);
🟩 64       }
⬜ 65     
⬜ 66       @Post('logout')
⬜ 67       @ApiOkResponse({
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
⬜ 20         res.status(200).end(res.getHeader('Set-Cookie'));
⬜ 21       }
⬜ 22     
🟩 23       async login(req, res) {
🟩 24         const { email, password } = req.body;
🟩 25         const userEmail = email?.toLowerCase();
🟩 26     
🟩 27         if (!userEmail || !userEmail.includes('@')) {
🟩 28           res.status(422).json({ message: 'Invalid email' });
🟩 29           return;
🟩 30         }
🟩 31     
🟩 32         if (!password || password.trim().length < 7) {
🟩 33           res.status(422).json({
🟩 34             message:
🟩 35               'Invalid input - password should be at least 7 characters long.',
🟩 36           });
🟩 37           return;
🟩 38         }
🟩 39     
🟩 40         const existingUser = await prisma.user.findFirst({
🟩 41           where: {
🟩 42             email: userEmail,
🟩 43           },
🟩 44         });
🟩 45         if (existingUser) {
🟩 46           const verified = await verifyPassword(password, existingUser.password);
🟩 47           if (verified) {
🟩 48             delete existingUser.password;
🟩 49             const sessionID = await getSessionIdFromUserData(existingUser);
🟩 50             setCookie(res, 'sessionID', sessionID, {
🟩 51               maxAge: 1000 * 60 * 60,
🟩 52               path: '/',
🟩 53               httpOnly: true,
🟩 54             });
🟩 55             res.setHeader('Access-Control-Allow-Credentials', 'true');
🟩 56             res.status(200).end(res.getHeader('Set-Cookie'));
🟩 57             return;
🟩 58           }
🟩 59         }
🟩 60         res.status(401).json({ message: 'Unauthorized' });
🟩 61       }
⬜ 62     
⬜ 63       async register(req, res) {
⬜ 64         const { name, email, password } = req.body;
```

<br/>

### logout \[POST\]




<br/>



<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/microservices/auth/src/app/auth.controller.ts
```typescript
⬜ 63         return this.authService.login(request, response);
⬜ 64       }
⬜ 65     
🟩 66       @Post('logout')
🟩 67       @ApiOkResponse({
🟩 68         description:
🟩 69           'User successfully logged out and cookie removed from initiator.',
🟩 70       })
🟩 71       async logout(@Req() request: Request, @Res() response: Response) {
🟩 72         return this.authService.logout(request, response);
🟩 73       }
⬜ 74     
⬜ 75       @Get('me')
⬜ 76       @ApiOkResponse({
```

<br/>

1.  set [[sym-text:sessionID(325358ab-0229-43d9-b1a3-1997afdb1792)]] cookie value to 0 & max age to '-1' and send it to the client to delete from his browser
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/microservices/auth/src/app/auth.service.ts
```typescript
⬜ 10     
⬜ 11     @Injectable()
⬜ 12     export class AuthService {
🟩 13       async logout(req, res) {
🟩 14         setCookie(res, 'sessionID', 0, {
🟩 15           maxAge: -1,
🟩 16           path: '/',
🟩 17           httpOnly: true,
🟩 18         });
🟩 19         res.setHeader('Access-Control-Allow-Credentials', 'true');
🟩 20         res.status(200).end(res.getHeader('Set-Cookie'));
🟩 21       }
⬜ 22     
⬜ 23       async login(req, res) {
⬜ 24         const { email, password } = req.body;
```

<br/>

### me \[GET\]




<br/>



<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/microservices/auth/src/app/auth.controller.ts
```typescript
⬜ 72         return this.authService.logout(request, response);
⬜ 73       }
⬜ 74     
🟩 75       @Get('me')
🟩 76       @ApiOkResponse({
🟩 77         description: 'Returns user data if logged in',
🟩 78         type: UserData,
🟩 79       })
🟩 80       @ApiUnauthorizedResponse({
🟩 81         description: 'Unauthorized',
🟩 82       })
🟩 83       @ApiForbiddenResponse({
🟩 84         description: 'Unauthorized - Blocked by auth guard',
🟩 85       })
🟩 86       async me(@Req() request: Request, @Res() response: Response) {
🟩 87         return this.authService.me(request, response);
🟩 88       }
⬜ 89     }
```

<br/>

1.  get [[sym-text:userData(d7f97296-4593-4a79-a739-42bbec95f1f9)]] from the response.
    
2.  check if [[sym-text:id(d8d30c50-97dd-4b7c-b744-9008066822a7)]] exist if it's exist return the userData as JSON.
    
3.  if not return 401 to the client (in order to be redirected there to logout)
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 apps/microservices/auth/src/app/auth.service.ts
```typescript
⬜ 128        res.status(201).end(res.getHeader('Set-Cookie'));
⬜ 129      }
⬜ 130    
🟩 131      async me(req, res) {
🟩 132        const { userData } = res.locals;
🟩 133        if (userData?.id) {
🟩 134          res.status(200).json({ userData });
🟩 135          return;
🟩 136        }
🟩 137        res.status(401).send('unauthorized');
🟩 138      }
⬜ 139    }
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBc3luY2l0JTNBJTNBdGlrYWxr/docs/nd95a).