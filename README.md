# Jira Metrics Server

This is the web server for the application that calculates two types of metrics for your Jira projects.
Here you can find the guide about how to configure and use it.

## Installation for development

1. Install **node:13** for your system and run `npm install --global yarn`.
2. Clone the repository.
3. Create **.env** file in the root of the project and add variables to it. You can copy **.env.example** to use it as a template.
4. Run `yarn` to install dependencies for the project.
5. Run `yarn start:dev` to run the application in development mode.

## Run production build

1. Install **docker:19.03.5** and **docker-compose:1.24.1** for your system.
2. Clone the repository.
3. Create **.env** file in the root of the project and add variables to it. You can copy **.env.example** to use it as a template.
4. Build and run the container from the docker-compose file.

---

## API Overview

```
GET /api/metrics/value-vs-bugs?startDate=${date}&endDate=${date}&user=${username}
```
Computes *Adding value vs bugs* metric for user. **Requires basic authentication**.

### Response object:
```
{
    "issuesTimeSpent": 201600,
    "bugsTimeSpent": 88200,
    "ratio": 0.4375,
    "result": "not performing"
}
```

---

```
GET /api/metrics/component-health?startDate=${date}&endDate=${date}
```
Computes *Component health* metric for all components of a project. **Requires basic authentication**.

### Response object:
```
{
    "equalShare": 46200,
    "ratios": [
        {
            "leader": "mikhail.kotsikau",
            "ratio": 0.24675324675324675,
            "result": "underperforming"
        },
        {
            "leader": "lipanomer1",
            "ratio": -0.961038961038961,
            "result": "exceeds expectations"
        },
        {
            "leader": "admin",
            "ratio": 0.7142857142857143,
            "result": "underperforming"
        }
    ]
}
```