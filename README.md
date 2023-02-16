# Image grading Strapi
Strapi for image grading application to grade training data for the OrQA project.

## About

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin ante at eleifend eleifend. Sed non vestibulum nisi. Aliquam vel condimentum quam. Donec fringilla et purus at auctor. Praesent euismod vitae metus non consectetur. Sed interdum aliquet nisl at efficitur. Nulla urna quam, gravida eget elementum eget, mattis nec tortor. Fusce ut neque tellus. Integer at magna feugiat lacus porta posuere eget vitae metus.

Curabitur a tempus arcu. Maecenas blandit risus quam, quis convallis justo pretium in. Suspendisse rutrum, elit at venenatis cursus, dolor ligula iaculis dui, ut dignissim enim justo at ligula. Donec interdum dignissim egestas. Nullam nec ultrices enim. Nam quis arcu tincidunt, auctor purus sit amet, aliquam libero. Fusce rhoncus lectus ac imperdiet varius. Sed gravida urna eros, ac luctus justo condimentum nec. Integer ultrices nibh in neque sagittis, at pretium erat pretium. Praesent feugiat purus id iaculis laoreet. Proin in tellus tristique, congue ante in, sodales quam. Sed imperdiet est tortor, eget vestibulum tortor pulvinar volutpat. In et pretium nisl.

### Project Team
Colin Wilson, Newcastle upon Tyne Hospitals NHS Foundation Trust  ([lcolin.wilson6@nhs.net](mailto:lcolin.wilson6@nhs.net))    

### RSE Contact
Kate Court
RSE Team  
Newcastle University  
([kate.court@newcastle.ac.uk](mailto:kate.court@newcastle.ac.uk))  

## Built With

[Strapi](https://strapi.io/)  

## Getting Started

### Prerequisites
Requires Node.js (v14, v16 or v18) and npm (v6 only) or yarn. Requires a database (MySQL, MariaDB, PostgreSQL or SQLite). 

If using MySQL, the user Strapi uses must use the authentication plugin `mysql_native_password` (rather than the newer `caching_sha2_password`). You can check what plugin is in use by running this SQL command (where root is the username):

`SELECT user, plugin FROM mysql.user WHERE user IN ('root');`

If you need to change the authentication plugin used (where username is root and password is admin):

`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';`

Images (during development for the BTS conference):
Once an image is in the oracle bucket, it should be placed in either the 'real' or 'artificial' folders. For each image, go to the strapi admin UI and add a new 'Image' document. The filename should be the image filename including the extension, prefaced by the folder it is stored in. For example of an image called 'image2.jpg' in the real folder, the image filename in strapi should be added as 'real/image2.jpg'. You should also create a relation with either the 'liver' or 'kidney' organ type (you may need to create entries for these in the organ collection first). Select whether the image is real using the boolean toggle. Scores and comparisons relations will be added once users use the application so you can leave blank. The origin is for once we add actual images of organs to Oracle so we can note here where they come from. Leav blank for testing. 

### Installation

```
yarn add strapi
```

### Running Locally

 `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-develop)

```
npm run develop
# or
yarn develop
```

`start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-start)

```
npm run start
# or
yarn start
```

 `build`

Build your admin panel. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-build)

```
npm run build
# or
yarn build
```

### Running Tests

How to run tests on your local system.

## Deployment

### Local

Deploying to a production style setup but on the local system. Examples of this would include `venv`, `anaconda`, `Docker` or `minikube`. 

### Production

NB: we have taken a different route of deploying on oracle for the moment, using
docker on a compute instance (VM) as there is currently no way of assigning a
static IP in advance for a container instance, which means we cannot know what
external url to assign to the environment variables, and unfortunately oracle
also does not allow retrospective altering of environment variables on contianer
instances.
That said, this may prove useful in future when static IPs are implemented for 
container instances.


1. Generate an auth token
https://docs.oracle.com/en-us/iaas/Content/Functions/Tasks/functionsgenerateauthtokens.htm 

2. Log into docker with oracle creds:
https://docs.oracle.com/en-us/iaas/Content/Functions/Tasks/functionslogintoocir.htm

`docker login lhr.ocir.io`

username in this format lrrho0j0b1ox/oracleidentitycloudservice/kate.court@ncl.ac.uk
password is from the auth token you generated

3. build docker image using tag format required br container registry

`docker build -t lhr.ocir.io/lrrho0j0b1ox/orqa-containers/orqa-strapi:latest .`

4. push to registry

`docker push lhr.ocir.io/lrrho0j0b1ox/orqa-containers/orqa-strapi:latest`

5. NB: We then had to move to the development compartment as this appeared in root
- check on the Oracle cloud whether the container has been pushed to the correct
  compartment. It is easily moved using the UI if not.


Longer term, look at putting in a github action, this might help: https://github.com/oracle-actions/login-ocir 

Note: the deployment currently relies on creating a 'pre-authenticated request' for the bucket and using this URL as the `bucket_url` in the strapi env's. This option is available within the bucket on Oracle.

#### Deploying as a docker container in an Oracle Compute instance

Make sure you have VCN set up in advance, which will contain the strapi compute
instance, the database and the angular container instance.

1. Create a compute instance on the Oracle Cloud, ensuring it is inside the correct
compartment, and in the public subnet of the VCN. Generate or add an ssh key as
part of the creation.

2. Once created, select 'Quick Actions' from the left hand menu under the
Resources title, and set up the instance to access the internet.

3. Add the ssh key to your local .ssh folder

4. Log into the instance from your local command line with `ssh -i
.ssh/ssh-key.key opc@<instance_IP>`
(NB, if having issues, check the ssh key has the right permission settings with `chmod 400 ssh-key.key`

5. Once inside the instance, install git, yarn, node, docker and nvm (using yum,
assuming using an oracle linux base which is closest to CentOS).

6. Pull the strapi repo to the instance. You may need to update the environment variables in the Dockerfile using, e.g. nano.

7. Build the docker container inside the repository directory using `sudo docker build -t orqa-strapi .`

8. Once built, run the docker container using `sudo docker run -p 1337:1337
--detach orqa-strapi`

9. Check everything is working as intended by viewing the logs. First check the
instance ID with `sudo docker ps` then use the ID that shows up for the running
container to access the logs: `sudo docker logs -f <container_ID>`

10. You may need to disable the firewall if the web interface is not showing.
Check the firewall status with `sudo systemctl status firewalld`, if it is on
then you can turn it off with sudo `systemctl stop firewalld`.

##### Updating the docker container

1. First stop the running instance, find the id with `sudo docker ps`, then
`sudo docker stop <instance_ID>`

2. Pull the latest changes from github `git pull` 

3. Rebuild the docker container and re-run it, following instructions from
number 7 onwards above.

#### Setting up the mysql database

The strapi instance needs a mysql database to connect to, and when deploying on
the cloud a mysql database will need to be created in the same VCN as the strapi
and angular containers.

1. Create a blank mysql database server using the Oracle Cloud web interface.
Ensure it is created inside the same VCN (private subnet is fine) and note the
admin login details that are created as part of the process. Select the
configuration file that ends with 'strapiauthentication'.

2. Log into the database either using the strapi compute instance or using the
Oracle Cloud Shell (launch from top bar under developer tools). For the compute
instance will first need to install mysqlsh.
`mysqlsh <admin_username>@<mysql_server_IP>`
The mysql server IP can be found by checking the details of the mysql database
server on the Oracle Cloud web interface. If you cannot connect, you may need to check the ingree rules within the private network security lists for the Virtual Cloud Network. There should be a CIDR rule for source 10.0.0.0/24 detination port 3306 (we may also need another for port 33060). We may need to refine our ingress rules to become more secure after the BTS conference. 

3. Once logged into the database server, you will then need to create the
database itself. `\sql CREATE DATABASE orqaDB`

4. We also need to create a new admin username that will be authenticated using
the mysql\_native\_password plugin. The strapiauthentication configuration file
will ensure that any new users will use the native plugin by default. To create
the new admin user, use: `\sql CREATE USER '<username>'@'<sql_server_IP>' IDENTIFIED
BY '<password>' DEFAULT ROLE 'administrator'`. You can check this worked with the command `\sql select user, plugin from mysql.user where user='username'`. To view all information about a user: `\sql select * from mysql.user where user='username'`. On the production database, it was necessary to change the host for this user to "%" using `\sql rename user "admin2"@"10.0.1.67" to "admin2"@"%"`. In future we may want to limit this.

5. Update the strapi environment variables to point to the database server IP, database
name and to the new admin username and password.


Other useful commands:
`\sql select user, plugin from mysql.user`
check user accounts and authentication methods. Can use this syntax to find out many more things about users.

## Usage

Any links to production environment, video demos and screenshots.

## Roadmap

- [x] Initial Research  
- [ ] Minimum viable product <-- You are Here  
- [ ] Alpha Release  
- [ ] Feature-Complete Release  

## Contributing

### Main Branch
Protected and can only be pushed to via pull requests. Should be considered stable and a representation of production code.

### Dev Branch
Should be considered fragile, code should compile and run but features may be prone to errors.

### Feature Branches
A branch per feature being worked on.

https://nvie.com/posts/a-successful-git-branching-model/

## License

## Citiation

Please cite the associated papers for this work if you use this code:

```
@article{xxx2021paper,
  title={Title},
  author={Author},
  journal={arXiv},
  year={2021}
}
```


## Acknowledgements
This work was funded by a grant from the UK Research Councils, EPSRC grant ref. EP/L012345/1, “Example project title, please update”.







# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html) (CLI) which lets you scaffold and manage your project in seconds.



## ⚙️ Deployment

Strapi gives you many possible deployment options for your project. Find the one that suits you on the [deployment section of the documentation](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/deployment.html).

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://docs.strapi.io) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>


