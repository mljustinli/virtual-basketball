# Virtual Basketball

It's basketball on Friday's... but virtual. Social distancing yay.

## Setup

- Clone the repository
- cd into the directory
- Run `npm install`
	-make sure node is in PATH (if its not, run set PATH=<nodejs location>;%PATH%)
- If you get an ENOENT error just keep running it :)
- Run `node app.js` or `npm start` (use while developing to auto refresh the server after edits)

## Deploy Instructions

- WIP
Technologies and architecture used  

	In order to collaborate efficiently and effectively, the team needed to be in constant communication. Due to COVID-19, communication took place through Microsoft teams.

	We created a lightweight NodeJS application that creates objects for gameplay (Basketball, Hoop, Players, and Games), that are coordinated with and communicated to the client on connection. The scoring, passing, and stealing rely on detecting collisions with the player/ball/hoop objects. Players have a team attribute, and are given the option of selecting a team upon entering the game. The artwork, including the court players hoop and scoreboard, are all created using the P5 JS library. 

What your code is designed for 
	Our code is designed to bring a sense of community to the office during these unprescedented times. In the past, friendly basketball games have been used to help promote office comradery. With new hires coming on remotely, it can be difficult to integrate to FIS culture. We believed there was an opportunity to encourage friendly communication, and more seamlessly transition new hires into full fledged team members. 

What your code was written in 
	Our basketball game is written primarily in JavaScript, while the webpage has a small amount of HTML and CSS 

Open source or proprietary software used (if applicable) 
	We utilized NodeJS modules, and JS libraries  to assist our development.

Why it's cool 

	Our game has the basic features of basketball, but plenty of room for growth and further development. This project could continue to include features such as player customization, fouls, taunting, and more. What we accomplished in 48 hours is a game that we all really not only wanted to make, but to play together. Though the teams may have a small rivalry in game, it ultimately brings the entire group closer, and encourages us to win as one team.
