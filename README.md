<img src="http://i.imgur.com/Cb3D7Bp.png" alt="MailByGrunt" />

MailByGrunt is a workflow for designing and testing emails. MailByGrunt will inline CSS, build your email templates, upload images onto your server (using SFTP) and send a test email to your inbox.

## Requirements

* Node.js
* Grunt-CLI and Grunt
* Ruby
* Premailer
* GMAIL account (used to send the test emails)

## Diving in

<pre>
git clone https://github.com/invmatt/MailByGrunt.git
cd MailByGrunt
npm install
gem install premailer
</pre>

## Initial setup

1. Open up GruntFile.js. On lines 21 & 22 add the client name and the email address you want to send all previews to.
2. Line 231 within GruntFile.js edit the location for images to be uploaded in to (Example: /var/public_html/someclientname)
3. Line 248 within GruntFile.js add the domain (example: http://yourdomain.com/clientname/)
4. <code>config/ftp-config.json</code> & <code>.ftppass</code> - Add your SFTP details within here
5. <code>nodemailer-transport.json</code> - Add your GMAIL credentials

## Using MailByGrunt

<img src="http://i.imgur.com/uXS68Hl.png" alt="Using MailByGrunt" />

### CSS

MailByGrunt uses SCSS (and Compass), for any changes modify the .scss files.

### Email Templates

<code>/src</code> - All templating should be done within here (maintaining the structure within)
<code>/dist</code> - This is where your compiled code will end up

### Generate your email templates

<code>grunt dev</code> - This should be used during development and watches for any template changes.

<code>grunt dist</code> - This compiles all code and outputs the final result under <code>/dist</code>.

<code>grunt send</code> - Sends the email to yourself (requires a Gmail Account).

### Changelog

[Available on the Wiki](https://github.com/invmatt/MailByGrunt/wiki/Changelog)
