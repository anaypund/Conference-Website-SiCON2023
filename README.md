# SiCON 2023 (International Conference on IoT, Big Data and Machine Learning)

The Website is made using HTML, CSS and vanilla Javascript for frontend and Node.js, Express.js for Backend and MongoDB, Mongoose for database.

The website is all about recieving research paper from the user. The unique ID is generated automatically for each user with different domain. An automatic email is generated and sent to user (for confirmation) and reviewer team (for checking and grading) with all the details of applicant.

The submitted papers will be saved automatically with .docx extension with the applicant's unique ID and will be saved in respective folders differentiated on the basis of topics or domains.

After submission of paper once reviewer team sends the grading and confirmation, the user will do payment and upload the payment receipt on the website which will automatically converted into .pdf and will be saved in very respective folder differentiated by the domains. the file will be saved with the applicants unique ID.

An dedicated ADMIN PANEL: Where reviewer team can access the database in very user friendly interface and perform actions like sorting, searching, downloading the papers which are submitted, checkbox which will be automatically be checked once user submit receipt of payment, also can download the receipt with one click of button. An "send acceptance email" button which will send an auto-generated email to the applicants.

Was hosted on AWS litesail on Ubuntu server.
reverse proxy with nginx.
The logic is developed in such a way that everything can be done just on a click.

Automatic ID generation, file handling, trash database, payment recipt check, automatic emails, paper evaluation admin panel (add /admin in front of the link) and many more.

If you want to use the code without any errors:			
	1. Add your emails in src/main.js file (I've leaved the emails field blank for you and added a comment "//add some field")
	2. Connect to one of your database first to make the site useful and running.
	3. add a .env file and insert the MONGO_URI to successfully connect the database.
	4. That's It!
	
Feel Free to reach me in any cases of doubts or just a little talk :)
	anaypund123@gmail.com
	
