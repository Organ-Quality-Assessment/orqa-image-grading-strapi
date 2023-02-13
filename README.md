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

If using MySQL, the user Strapi uses must use the authentication plugin `mysql_native_password` (rather than the newer `caching_sha2_password`). You can check what plugin is in use byb running this SQL command (where root is the username):

SELECT user, plugin FROM mysql.user WHERE user IN ('root');

If you need to change the authentication plugin used (where username is root and password is admin):

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';

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

Generate an auth token
https://docs.oracle.com/en-us/iaas/Content/Functions/Tasks/functionsgenerateauthtokens.htm 

Log into docker with oracle creds:
https://docs.oracle.com/en-us/iaas/Content/Functions/Tasks/functionslogintoocir.htm

docker login lhr.ocir.io

username in this format lrrho0j0b1ox/oracleidentitycloudservice/kate.court@ncl.ac.uk
password is from the auth token you generated

build docker image using tag format required br container registry

docker build -t lhr.ocir.io/lrrho0j0b1ox/orqa-containers/orqa-strapi:latest .

push to registry

docker push lhr.ocir.io/lrrho0j0b1ox/orqa-containers/orqa-strapi:latest

I then had to move to the development compartment as this appeared in root - perhaps the naming is wrong here?

Create container instance and provide the username and password you used when logging in through docker

Longer term, look at putting in a github action, this might help: https://github.com/oracle-actions/login-ocir 


To connect to the mySQL database in oracle, you need to first ssh into a compute instance (https://docs.oracle.com/en-us/iaas/Content/Compute/Tasks/accessinginstance.htm). You will then need to install mysql (https://docs.oracle.com/en-us/iaas/mysql-database/doc/compute-instance.html#GUID-70023ABD-5418-4C1F-975F-F3E2ABC0F93E). 

`ssh -i filepath/ssh-key.key opc@130.162.168.182`
where the ip is the compute instance public ip

first time logging into a fresh compute instance you will need to ensure mysql shell is installed:
`sudo yum install mysql-shell`
Connecting to an existing instance where this has already been done means you can skip this step.

Connect to mysql

`mysqlsh orqadmin@10.0.1.45`

To create a new user:
`\sql CREATE USER ‘nativeuser’@’localhost’IDENTIFIED WITH mysql_native_password BY ‘password’`

new user called admin2 which we are using for our connection.

Other useful commands:
`\sql select user, plugin from mysql.user`
check user accounts and authentication methods. Can use this syntax to find out many more things about users.


To connect to cloud instance for connecting to the database in dev, get the private key from Sharepoint and run this command:
chmod 400 oracle_dev_cloud_instance_key.key

ssh -i oracle_dev_cloud_instance_key.
key opc@130.162.168.182

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


