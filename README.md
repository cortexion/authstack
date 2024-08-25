---------------------------------------------------------------------------
Frontend development:

`\Documents\authstack\frontend> npm run start`

Frontend build:

`\Documents\authstack\frontend> npm run build`

Start server:

`\Documents\authstack> mvn spring-boot:run`

---

Package .jar and then push to deploy:

`Maven -> Run Maven Commands -> package`

Test jar locally:

`C:\Users\...\demo\target> java -jar App-0.0.1-SNAPSHOT.jar`

http://localhost:8080/api/auth/signup
`{
"username": "testerman",
"email": "testerman@testerman.com",
"password": "testerman",
"role": ["user", "mod", "admin"]
}`

Open `src/main/resources/application.properties`

```
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=

spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation= true
spring.jpa.properties.hibernate.dialect= org.hibernate.dialect.PostgreSQLDialect

# Hibernate ddl auto (create, create-drop, validate, update)
spring.jpa.hibernate.ddl-auto= update

# App Properties
demo.app.jwtSecret= ======================spring===========================
demo.app.jwtExpirationMs= 86400000
```

## Run following SQL insert statements

```
INSERT INTO roles(name) VALUES('ROLE_USER');
INSERT INTO roles(name) VALUES('ROLE_MODERATOR');
INSERT INTO roles(name) VALUES('ROLE_ADMIN');
```
