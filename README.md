# Image grading Strapi
Strapi for image grading application to grade training data for the OrQA project.

## About

Transplantation is the best treatment for patients with organ failure irrespective of the organ required. Currently over 6,000
patients are waiting in the United Kingdom. Focusing on kidney transplantation the figures are stark with a patient living twice
as long with a transplant, when compared with dialysis, and over ten years a kidney transplant saves the NHS £420,000 per
patient.    

Organs donated for transplantation are sometimes not used because of concerns about infections or cancer, but most
commonly because of worries that they won’t function adequately in the recipient and might lead directly to the patient dying. At
the moment assessing organs for transplantation is subjective and depends on the skills of the surgical team. In the United
Kingdom the rate of use of organs varies widely between centres, from 70% to 30%. This device aims to support all surgeons
to use the achievable 70% of donated organs.

This project will involve training machine learning models to score the quality of organs being considered for transplantation.

### Project Team
Colin Wilson, Newcastle upon Tyne Hospitals NHS Foundation Trust  ([colin.wilson6@nhs.net](mailto:colin.wilson6@nhs.net))    
Hassan Ugail, University of Bradford

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

#### Images (during development for the BTS conference):
Once an image is in the oracle bucket, it should be placed in either the 'real' or 'artificial' folders. For each image, go to the strapi admin UI and add a new 'Image' document. The filename should be the image filename including the extension, prefaced by the folder it is stored in. For example of an image called 'image2.jpg' in the real folder, the image filename in strapi should be added as 'real/image2.jpg'. You should also create a relation with either the 'liver' or 'kidney' organ type (you may need to create entries for these in the organ collection first). Select whether the image is real using the boolean toggle. Scores and comparisons relations will be added once users use the application so you can leave blank. The origin field is to note where this image came from, e.g. from the NORIS dataset.

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

### Production


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
BY '<password>' DEFAULT ROLE 'administrator'`

5. Update the strapi environment variables to point to the database server IP, database
name and to the new admin username and password.


Other useful commands:
`\sql select user, plugin from mysql.user`
check user accounts and authentication methods. Can use this syntax to find out many more things about users.

#### Deploying to an Oracle Container Instance

NB: it is possible to assign the strapi public_url env variable to a orqa.uk URL, and then use DNS to route this URL to the newly generated IP address of the container instance so we have been able to switch from using a VM to using a container instance for strapi.

There is now a GitHub Action for building an image and pushing to the Oracle Container Registry. Once the Action is complete, restart the corrosponding Container Instance through the OCI CLI or the UI. To set up the container for the first time, or if GitHub Actions breaks, follow these instructions.

1. Generate an auth token
https://docs.oracle.com/en-us/iaas/Content/Functions/Tasks/functionsgenerateauthtokens.htm 

2. Log into docker with oracle creds:
https://docs.oracle.com/en-us/iaas/Content/Functions/Tasks/functionslogintoocir.htm

`docker login lhr.ocir.io`

Username is in this format `<tenancy-namespace>/<username>`, e.g. `lrrho0j0b1ox/oracleidentitycloudservice/kate.court@ncl.ac.uk`. You can find this information in the Tenancy Information page on Oracle. Password is the auth token you generated.

3. build docker image using tag format required by container registry

`docker build -t <region-key>.ocir.io/<tenancy-namespace>/<repo-name>:latest .`

e.g.
`docker build -t lhr.ocir.io/lrrho0j0b1ox/orqa-strapi:latest .`

4. push to registry

`docker push <tag>`

e.g.
`docker push lhr.ocir.io/lrrho0j0b1ox/orqa-strapi:latest`

5. If there is an existing container instance on the cloud linked to the container repository then it can be refreshed to pull the latest changes.

If not, or you want to make a new one, create the container instance and provide the username and password you used when logging in through docker then make sure that it is inside the same VCN as the other components (the database and the angular client). It will also need to be in the subregion A1.
Provide the environment variables when creating the container including the DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, PORT,DATABASE_HOST, API_KEYS and fields for secrets and the api token. The database fields can be filled in by checking the details of the sql database on oracle.

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

3. Rebuild the docker container and re-run it, following instructions from number 7 onwards above.

## Usage

Staging: http://130.162.168.182:1337/admin/auth/login 
Production: http://132.145.70.187:1337/admin/auth/login 

## Roadmap

- [x] Initial Research  
- [x] Minimum viable product   
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
