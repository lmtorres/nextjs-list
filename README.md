## Getting Started

Install npm dependencies:

```
npm install
```

Create and seed the database:

```
npx prisma migrate dev
```

Start the app:

```
npm run dev
```


### Test email authentication 

Create a [mailtrap.io](https://mailtrap.io/) account and get your credentials.

Add the following values to your .env file:
```
EMAIL_SERVER=smtp://{username}}:{password}}@smtp.mailtrap.io:587
EMAIL_FROM=noreply@example.com
NEXTAUTH_URL=http://localhost:3000
```
