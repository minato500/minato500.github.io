# Lab Setup: Vulnerable API Application

To practice API hacking hands-on, I've created a deliberately vulnerable API application that runs in Docker. This setup provides a safe, isolated environment for learning and testing various API vulnerabilities

In this lab environment, the exact HTTP request method (example `GET`, `POST`, `PUT`, `PATCH`, `DELETE`) is explicitly specified for each exercise. This is done intentionally because there is no interactive frontend application to handle requests automatically

In real-world scenarios:
- A proper frontend (web or mobile app) would send the correct method behind the scenes when you perform actions like submitting a form or updating settings.
- During actual security testing or bug bounty hunting, you often need to discover or infer the appropriate method yourself, through documentation, observing legitimate traffic, trial and error, or analyzing the API design

By specifying the method here, the focus remains on understanding the vulnerability and crafting the payload, making the learning process clearer and more beginner friendly without the added complexity of method discovery

### Initial Setup

1. Clone the repository:

```
git clone https://github.com/minato500/vulnerable-api-application.git
cd minato500/vulnerable-api-application
```

2. Build and start the application:

```
docker-compose up --build
```

- This command builds the Docker images (if not already built) and starts all required containers
- The first run may take a few minutes

3. Access the application:

- Once running, open your browser and visit: http://localhost:8090


### Stopping the Application

- To stop the running containers gracefully:

```
# Press Ctrl+C in the terminal where docker-compose is running
# OR run this command in another terminal
docker-compose down
```

- To stop and remove all associated data (volumes, databases, etc.):

```
docker-compose down -v
```

- Use this when you want a completely clean slate (example resetting user accounts or database state)

**Resetting the Lab for New Exercises**

Many labs involve modifying user privileges (example escalating a regular user to admin via vulnerabilities like mass assignment). These changes persist in the database

- To reset everything to its original state before starting a new lab:

```
docker-compose down -v && docker-compose up -d
```
down -v: Stops containers and removes volumes (resets database and persisted data)
up -d: Restarts the containers in detached (background) mode

After running this, refresh http://localhost:8090 — the application will be back to its initial vulnerable state

### Tips

- Always run these commands from the directory containing the docker-compose.yml file
- If you encounter port conflicts (e.g., port 8090 already in use), stop other services or modify the port mapping in docker-compose.yml.

This setup ensures you can break, and reset the application as many times as needed during your learning journey!

Happy Learning :)