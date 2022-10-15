<br />
<div align="center">

  <h3 align="center">Bregenz Bewegt</h3>

  <p align="center">
    Mobile App for the Bregenz Bewegt project
  </p>

[![NX][nx]][nx-url] [![Ionic][ionic]][ionic-url] [![TypeScript][typescript]][typescript-url] [![React][react]][react-url] [![Nest][nest]][nest-url] [![JWT][jwt]][jwt-url] [![Prisma][prisma]][react-url] [![MySQL][mysql]][mysql-url] [![Jest][jest]][jest-url]

</div>

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/bregenz-bewegt/bregenz-bewegt.git
   ```
2. Install [nvm][nvm-url] and set node version to `14.20.0`
   ```sh
   nvm install 14.20.0
   nvm use 14.20.0
   ```
3. Install npm packages
   ```sh
   npm i
   ```
4. Setup [Android Studio][android-studio-url] (Windows), [XCode][xcode-url] (Mac) or another mobile emulator of your choice
5. Install [MySQL][mysql-url]
6. Initialize database
   ```sh
   npm run prisma:db:push
   ```
7. Feed database with mock data
   ```sh
   npm run prisma:seed
   ```
8. Configure environment variables in `.env` file (view `.example.env` for more information)
9. Run app (view `package.json` scripts for more information)
   ```sh
   npm run dev
   ```

[ionic]: https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white
[ionic-url]: https://ionicframework.com/
[capacitor]: https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=Capacitor&logoColor=white
[capacitor-url]: https://capacitorjs.com/
[react]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[prisma]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[prisma-url]: https://www.prisma.io/
[nest]: https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white
[nest-url]: https://nestjs.com/
[mysql]: https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white
[mysql-url]: https://www.mysql.com/
[nx]: https://img.shields.io/static/v1?style=for-the-badge&message=Nx&color=143055&logo=Nx&logoColor=FFFFFF&label=
[nx-url]: https://nx.dev/
[jwt]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white
[jwt-url]: https://jwt.io/
[typescript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[jest]: https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white
[jest-url]: https://jestjs.io/
[android-studio-url]: https://developer.android.com/studio
[xcode-url]: https://developer.apple.com/xcode/
[mysql-url]: https://www.mysql.com/
[nvm-url]: https://github.com/nvm-sh/nvm
