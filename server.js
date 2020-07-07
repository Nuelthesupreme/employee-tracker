const inq = require('inquirer');
const sql = require('mysql');

// DB connection setup
const ctn = sql.createConnection({
    host: "localhost",
    port: 3306,
    database: "employee_tracker",
    user: "root",
    password: "",
    multipleStatements: true,
});
ctn.connect();

// C.R.U.D. operations
function createOp(table, entryData) {
    ctn.query(`INSERT INTO ${table} SET ?`, entryData,
        (err, res, fld) => {
            if (err) throw err
            console.log(res)
        }
    )
}
function readOp(table, id = null, cb) {
    ctn.query(`SELECT * FROM ${table.toLowerCase()} ${id !== null ? ' WHERE id = ' + id : ''}`,
        (err, res, fld) => {
            if (err) throw err
            cb(res)
        }
    )
}
function updateOp(table, id, roleDataUpdate) {
    ctn.query(`UPDATE ${table} SET id = ? WHERE ${roleDataUpdate}`, id,
        (err, res, fld) => {
            if (err) throw err
            console.table(res)
        }
    ) 
}
function deleteOp(table, id) {
    ctn.query(`DELETE FROM ${table} WHERE id = ?`, id,
        (err, res, fld) => {
            if (err) throw err
            console.log(res)
        }
    )
}

// User operations
async function addEmployee() {
    const employeeData = await inq.prompt([
        {
            name: 'first_name',
            message: 'What is the first name of this employee?'
        },
        {
            name: 'last_name',
            message: 'What is the last name of this employee?'
        },
        {
            type: 'number',
            name: 'role_id',
            message: 'What is the role of this employee?'
        },
        {
            type: 'number',
            name: 'manager_id',
            message: 'Who is the manager of this employee?'
        }
    ])

    createOp('employee', employeeData);
}
async function addRole() {
    const roleData = await inq.prompt([
        {
            name: 'title',
            message: 'What is the title of this role?'
        },
        {
            type: 'number',
            name: 'salary',
            message: 'What is the salary of this role?'
        },
        {
            type: 'number',
            name: 'department_id',
            message: 'What is the department of this role?'
        }
    ])

    createOp('role', roleData);
}
async function addDepartment() {
    const departmentData = await inq.prompt([
        {
            name: 'name',
            message: 'What is the name of this department?'
        }
    ])

    createOp('department', departmentData);
}

async function viewAllEmployees() {
    readOp('employee', null, async employees => {
        // console.table(employees)
    });
}

async function viewAllDepartments() {
    readOp('department', null, async depts => {
        console.table(depts)
    });
}

function viewAllRoles() {
    readOp('role', null, async role => {
        console.table(role)
    });
}

async function updateRoles (){
    const roleDataUpdate = await inq.prompt([
        {
            name: 'title',
            message: 'what is the title of your role?'
        },
        {
            type: 'number',
            name: 'salary',
            message: 'What is the salary of this role?'
        },
        {
            type: 'number',
            name: 'department_id',
            message: 'What is the department of this role?'
        }
    ])
    updateOp('role', roleDataUpdate);
}

// Main func
async function main() {
    while (true){

        await inq.prompt([
            {
                type: 'list',
                name: 'operation',
                message: 'What service would you like to engage?',
                choices: ['Add employee', 'Add role', 'Add department', 'View all employees', 'View all departments', 'View all roles', 'updateRoles']
            },
        ]).then(async ({ operation }) => {
            switch (operation) {
                case 'Add employee': await addEmployee(); break;
                case 'Add role': await addRole(); break;
                case 'Add department': await addDepartment(); break;
                case 'View all roles': await viewAllRoles(); break;
                case 'View all employees': await viewAllEmployees(); break;
                case 'View all departments': await viewAllDepartments(); break;
                case 'Update roles': await updateRoles(); break;
                default: break;
            }
        }).catch(console.log)
    }
    console.log('shutting down main')
}

main()

// readOp('role')