# Guide how to set up


### 1. Set up the server (backend)
```bash
$ cd server
$ python3 -m venv venv
$ source venv/bin/activate 
$ pip install -r requirements.txt
$ python3 -m app
```
### 2. Set up the client (frontend)
```bash
$ (if yarn is not installed, run)  npm install -g yarn
$ cd client
$ yarn run dev
```
### 3. Open the website 
```bash
$ open http://localhost:3030
```

### 4. To Look all of the HTTP requests
```bash
$ open http://127.0.0.1:5000/docs
```

### 5. All of the Reports are located in the `reports` folder
#### Reports
    - DFD 
    - HIPO Diagram
    - Project Proposal
    - Team Contract
    - db.sql
    - EERD
    - Changes made to EERD 

### 6. Routes are all located inside `server/app/routes`

### 7. All of the pages are located inside `client/src/app/`

### 8. All of the components are located inside `client/src/components/`

### 9. `client/src/container` is where all of the global variables are stored for sharing it across the components and pages.
