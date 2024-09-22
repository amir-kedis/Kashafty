# ![Logo](READMEImages/logo-ex.png) Kashafty

This is Kashafty! An SPA for managing all the scout groups needs. Attendance, finance, activities you name it! we got it! 😉

<!-- Scout management system is a website implemented using **PERN stack**. This project is a 2nd year CUFE project for practicing on the fundamental rules of database system management. -->

<!-- TODO: replace with an image that have Kashafty on it or maybe a GIF -->

## 🤔 But why?

- Have you ever tried to record the attendance of over 500 person using only a paper and a pen? Well, we did and it was a mess!
- Have you ever had to make reports on something and found yourself in the face of a huge pile of papers that is impossible to handle? guess what, we did too!
- as a leader, have you ever found yourself in a headache trying to manage the mess of data and reports that come from every direction with no clear structure? we totally understand you!

So we made `Kashafty` the solution for all scout groups' problems. It is a website that helps you manage all your scouts' data, activities, finance and much more!

<!-- ## Our website is now on air🔥 -->

<!-- We deployed our website, although, it is still in progress so you might find some missing functionalities. -->

<!-- To login as a general captain use: -->

<!-- > email: general@gmail.com -->
<!-- > pass: 1234 -->

## 🚀 Quick start

To get started navigate to [Kashafty demo](https://scouts-managment-system-development.onrender.com/) and use this account to try out the Main functionalities:

> - email:[general@gmail.com](general@gmail.com)
> - pass: 1234

you can also create your own account and try out the system as a regular captain.

![Landing Page](READMEImages/Landing%20Page%20Cropped.png)

## 📖 Documentation and features

This website is based on a well structured database and a user friendly app, which helps in providing the best managerial experience to the scout captains. It helps them in:

### Scout management

- Getting Scouts' absence and statistics over a certain interval
- Sending automatic notifications in case of exceeding the limit of absence
- Adding/removing them from/to any sector

### Sectors management

- Adding/removing new sectors from/to the system
- Managing leading captains
- Managing Absence for each sector's leading captains

### Activities and sessions

- Saving each activity including it's type, place and time
- Grading scouts on the activities they joined and showing stats

### Finance management

- Adding weekly subscriptions
- Adding incomes and expenses to the system
- Getting updated value of the total balance and each transaction has been done

### Stats

- Viewing attendance stats for scouts and captains
- Providing graphs for better analysis
- Getting reports on the current system status

## 🧰 Tech Stack

- **Frontend**

<img src="https://img.icons8.com/color/48/000000/react-native.png"/> <img src="https://img.icons8.com/color/48/000000/redux.png"/> <img src="https://img.icons8.com/color/48/000000/javascript.png"/> <img src="https://img.icons8.com/color/48/000000/sass.png"/> <img src="https://img.icons8.com/color/48/000000/figma.png">

- **Backend**

<img src="https://img.icons8.com/color/48/000000/nodejs.png"/> <img src="https://img.icons8.com/color/48/000000/express-js.png"/> <img src="https://img.icons8.com/color/48/000000/postgreesql.png"/>

## Pre-implementation phase

### Database design

ER-design and schema designs for the database

![ER](READMEImages/scouts-managment-system-er-no-attr.drawio.png)

![Schema](READMEImages/Schema.jpg)

### Figma Design

We have designed a complete UX design for all system pages: about 40 pages

![Figma Design](READMEImages/FigmaDesign.png)

[View full figma design](https://www.figma.com/file/Yj8KCaGVDlDprgecgPdMwq/Scouts-Management-System?type=design&node-id=0%3A1&mode=design&t=rPMKLEZWaE6dBebp-1)

### User Stories

[User Stories](https://drive.google.com/file/d/1RwYU0OpM7EVVqLCTXDNxmlU7WgaKOdvz/view?usp=sharing)

## How to run locally?

> [!note]
> you need to have `docker` and `docker-compose` installed on your machine

1. clone the repo

```sh
git clone <repo-url>
cd kashafty
```

2. create a `.env` in the root of the repo and fill the following variables

```env
DB_USER=
DB_PASSWORD=
DB_NAME=kashafty
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=
JWT_EXPIRES_IN='60d'
NODE_ENV=development
PORT=5000
```

3. run the following command

```sh
docker-compose up
```

4. create the db doing the following

```sh
docker exec -it kashafty_backend_1 sh
npm run create-db
npm run seed-db
```

5. open your browser and navigate to `http://localhost:3000`

## Contributors

<!-- | ![Abdelruhman](https://avatars.githubusercontent.com/u/121282837?v=4) | ![Amir](https://avatars.githubusercontent.com/u/88613195?v=4) | ![Akram](https://avatars.githubusercontent.com/u/109467185?v=4) | ![Ahmed](https://avatars.githubusercontent.com/u/104217693?v=4) |
| --------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| [AbdelruhmanSamy](https://github.com/AbdelruhmanSamy/)                | [amir-kedis](https://github.com/amir-kedis/)                  | [akramhany](https://github.com/akramhany/)                      | [AhmedHamed3699](https://github.com/AhmedHamed3699)             |
 -->

| <img src="https://avatars.githubusercontent.com/u/121282837?v=4" width="100px" alt="Abdelruhman"> | <img src="https://avatars.githubusercontent.com/u/88613195?v=4" width="100px" alt="Amir"> | <img src="https://avatars.githubusercontent.com/u/109467185?v=4" width="100px" alt="Akram"> | <img src="https://avatars.githubusercontent.com/u/104217693?v=4" width="100px" alt="Ahmed"> |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [AbdelruhmanSamy](https://github.com/AbdelruhmanSamy/)                                            | [amir-kedis](https://github.com/amir-kedis/)                                              | [akramhany](https://github.com/akramhany/)                                                  | [AhmedHamed3699](https://github.com/AhmedHamed3699)                                         |
