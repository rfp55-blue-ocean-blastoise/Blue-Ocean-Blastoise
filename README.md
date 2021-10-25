<div id="top"></div>


<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h3 align="center">![book]</h3>

  <p align="center">
    Book Brother
    <br />
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#App Components">App Components</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

BookBrother is the premier mobile audio experience to listen to your epub books. Don’t have time to read or need to be somewhere else? No problem, just upload your epub to the app and click play from your library to begin getting knowledge injected into your earbuds.

Perhaps a demo?

<p align="right">(<a href="#top">back to top</a>)</p>


### Built With

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MUI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
![node.js](https://img.shields.io/badge/Node.js-20232A?style=for-the-badge&logo=nodedotjs&logoColor=green)
![Express](https://img.shields.io/badge/-Express-20232A?style=for-the-badge&logo=express&logoColor=yellow)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-white?style=for-the-badge&logo=mongodb&logoColor=4EA94B)
![AMAZON AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Blue-Ocean-Blastoise.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run client
   ```sh
   npm run react-dev
   ```
4. Run server
   ```sh
   npm run server
   ```
5. Create your own `config.js`
   ```js
   responsive: 'token for voice',
   mongoPW: 'mongo password here',
   aws_secret_access_key : 'YOUR_SECRET_ACCESS_KEY',
   aws_access_key_id : 'YOUR_ACCESS_KEY_ID',
   aws_bucket_region: 'YOUR_BUCKET_REGION',
   aws_bucket_name : 'YOUR_BUCKET_NAME',
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

## Usage

* Refer to [this](https://github.com/rfp55-blue-ocean-blastoise/Blue-Ocean-Blastoise/blob/s3/API.md) for API usage.
* Refer to [this](https://github.com/rfp55-blue-ocean-blastoise/Blue-Ocean-Blastoise/blob/main/Voice-Control.md) For Voice Commands.
* Refer to [this](https://github.com/rfp55-blue-ocean-blastoise/Blue-Ocean-Blastoise/blob/main/Book-Viewer.md) For Book Player Features.

<p align="right">(<a href="#top">back to top</a>)</p>


## Contributing

Refer to [this](https://github.com/rfp55-blue-ocean-blastoise/Blue-Ocean-Blastoise/blob/main/CONTRIBUTE.md) before beginning work on the project to setup your feature branch correctly.

<p align="right">(<a href="#top">back to top</a>)</p>


## App Components


### [Book Viewer and Narrator](client/components/player)

- Developed by [Justin Beere](https://www.linkedin.com/in/justin-beere/), [Kevin Gao](https://www.linkedin.com/in/kevinzhugao/), [Lenora Esquenazi](https://www.linkedin.com/in/lenora-esquenazi/), [Matthew Boyle](https://www.linkedin.com/in/matthewboyle1989/)
- Allows users to read an EPUB book along with a narration of the text. Users can change text size, speed, pitch, voice and choose to listen to a fireplace background if they so choose.

### [Book Player Research Engineer](client/components/player)

- Developed by [Daniel Ho](https://www.linkedin.com/in/dho1994/)
- Researched and managed which technology to use and implemented those tools within the Book Viewer.

### [Library and Voice Recognition](client/components/library)

- Developed by [Huong Nguyen](https://www.linkedin.com/in/huong-tran-nguyen/)
- Library page displays a list of EPUB books available in the app. The "My Account" page displays a user-specific list of EPUB books separated into 2 sections: "Reading Now" and "My Books". Users can search and sort through the books, as well as upload a personal EPUB or add an EPUB book from the library to their account. Users can also play a book, remove a book from the "Reading Now" section, and delete a book from their account.
- Users can use voice control to interact with the library and the book player by simply clicking on the microphone button to speak commands (please refer to the [voice command list](https://github.com/rfp55-blue-ocean-blastoise/Blue-Ocean-Blastoise/blob/main/Voice-Control.md))

### [Backend Architecture](server), [Database](database) and [Authentication](client/components)

- Developed by [Aaron Tran](https://www.linkedin.com/in/aaronltran/) and [Andrew Cho](https://www.linkedin.com/in/andrewgunncho/)
- We chose MongoDB to represent each document as a user with their own personal array of books and each book object will have a bookmark and the link to the EPUB file. The EPUB files are hosted in Amazon S3 on upload.
- For authentication, we used Firebase to handle the  user credentials alongside React Context to update the current user's MongoDB document on update. Firebase methods are also used for session persistence to enable a logged-in state.





<p align="right">(<a href="#top">back to top</a>)</p>


Project Link: [https://github.com/rfp55-blue-ocean-blastoise/Blue-Ocean-Blastoise](https://github.com/rfp55-blue-ocean-blastoise/Blue-Ocean-Blastoise)

## Acknowledgments

* Amazon S3
* React Reader
* Epub.js

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- Images -->

[book]: images/title.png
