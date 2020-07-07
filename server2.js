const mysql = require("mysql");
const inquirer = require("inquirer");

const dbOptions = {
  host: "localhost",
  port: 3306,
  database: "employee_tracker",
  user: "root",
  password: "password",
  multipleStatements: true,
};

const connection = mysql.createConnection(dbOptions);

const init = async () => {
  const questions = [
    {
      message: "What would you like to do?",
      name: "action",
      type: "list",
      choices: [
        {
          name: "View all employees",
          value: "viewAll",
          short: "View All Employees",
        },
        {
          name: "View employees by department",
          value: "employeesByDept",
          short: "Employees By Department",
        },
        {
          name: "View employees by Roles",
          value: "employeeByRoles",
          short: "Employees by roles",
        },
        {
          name: "View employees by manager",
          value: "employeesByManager",
          short: "Employees By Manager",
        },
        {
          name: "Add employee",
          value: "addEmployee",
          short: "Add Employee",
        },
        {
          name: "Add Department",
          value: "addDepartment",
          short: "Add Department",
        },
        {
          name: "Add role",
          value: "addRole",
          short: "Add Role",
        },
        {
          name: "Remove employee",
          value: "removeEmployee",
          short: "Remove Employee",
        },
        {
          name: "Update employee role",
          value: "updateRole",
          short: "Update Role",
        },
        {
          name: "Update employee manager",
          value: "updateManager",
          short: "Update Employee Manager",
        },
        {
          name: "End",
          value: "end",
          short: "End",
        },
      ],
    },
  ];

  const { action } = await inquirer.prompt(questions);

  if (action === "viewAll") {
    const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee LEFT JOIN role on employee.role_id = role.id
    LEFT JOIN department on role.department_id = department.id
    LEFT JOIN employee manager on manager.id = employee.manager_id;
    `;

    const onQuery = (err, rows) => {
      if (err) throw err;
      console.table(rows);
      init();
    };

    connection.query(query, onQuery);
  }

  if (action === "employeesByDept") {
    const query = "SELECT * FROM department";

    const onQuery = async (err, rows) => {
      if (err) throw err;

      const choices = rows.map((row) => {
        return {
          name: row.name,
          value: row.id,
          short: row.name,
        };
      });

      const questions = [
        {
          message: "Select a department:",
          name: "departmentId",
          type: "list",
          choices,
        },
      ];

      const { departmentId } = await inquirer.prompt(questions);

      const queryEmployeesByDepartment = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department
      FROM employee LEFT JOIN role on employee.role_id = role.id
      LEFT JOIN department on role.department_id = department.id
      WHERE department.id = ${departmentId};
      `;

      const onEmployeeQuery = (err, rows) => {
        if (err) throw err;
        console.table(rows);
        init();
      };

      connection.query(queryEmployeesByDepartment, onEmployeeQuery);
    };

    connection.query(query, onQuery);
  }

  if (action === "employeeByRoles") {
    const query = "SELECT * FROM role";

    const onQuery = async (err, roles) => {
      if (err) throw err;

      const choices = roles.map((role) => {
        return {
          name: role.title,
          value: role.id,
          short: role.title,
        };
      });

      const questions = [
        {
          message: "Select a role:",
          name: "roleId",
          type: "list",
          choices,
        },
      ];

      const { roleId } = await inquirer.prompt(questions);

      const queryEmployeesByRole = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department
      FROM employee LEFT JOIN role on employee.role_id = role.id
      LEFT JOIN department on role.department_id = department.id
      WHERE role.id = ${roleId}
      `;

      const onEmployeeQuery = (err, employees) => {
        if (err) throw err;
        console.table(employees);
        init();
      };

      connection.query(queryEmployeesByRole, onEmployeeQuery);
    };

    connection.query(query, onQuery);
  }

  if (action === "employeesByManager") {
    const queryManagers = `
    SELECT employee.id, employee.first_name, employee.last_name FROM employee
    INNER JOIN (SELECT DISTINCT(manager_id) FROM company_db.employee WHERE manager_id IS NOT NULL) as manager
    on employee.id = manager.manager_id
    `;

    const onQuery = async (err, managers) => {
      if (err) throw err;

      const choices = managers.map((manager) => {
        return {
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.id,
          short: `${manager.first_name} ${manager.last_name}`,
        };
      });

      const questions = [
        {
          message: "Select a manager:",
          name: "managerId",
          type: "list",
          choices,
        },
      ];

      const { managerId } = await inquirer.prompt(questions);

      const queryEmployeesByRole = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department
      FROM employee LEFT JOIN role on employee.role_id = role.id
      LEFT JOIN department on role.department_id = department.id
      WHERE employee.manager_id = ${managerId}
      `;

      const onEmployeeQuery = (err, employees) => {
        if (err) throw err;
        console.table(employees);
        init();
      };

      connection.query(queryEmployeesByRole, onEmployeeQuery);
    };

    connection.query(queryManagers, onQuery);
  }

  if (action === "addDepartment") {
    const questions = [
      {
        message: "What is the name of the department?",
        name: "name",
      },
    ];

    const { name } = await inquirer.prompt(questions);

    const query = `INSERT INTO department (name) VALUES ("${name}") `;

    const onQuery = (err) => {
      if (err) throw err;
      console.log("Successfully created a department");
      init();
    };

    connection.query(query, onQuery);
  }

  if (action === "addRole") {
    const queryDepartments = "SELECT * FROM department";

    const onQuery = async (err, departments) => {
      if (err) throw err;

      const choices = departments.map((department) => {
        return {
          name: department.name,
          value: department.id,
          short: department.name,
        };
      });

      const questions = [
        {
          message: "What is the role title?",
          name: "title",
          type: "input",
        },
        {
          message: "What is the salary?",
          name: "salary",
          type: "input",
        },
        {
          message: "What department does the role belong to?",
          name: "departmentId",
          type: "list",
          choices,
        },
      ];

      const { title, salary, departmentId } = await inquirer.prompt(questions);

      const addRoleQuery = `INSERT INTO role (title, salary, department_id) VALUES ("${title}", ${parseFloat(
        salary
      )}, ${parseInt(departmentId)})`;

      const onAddRole = (err) => {
        if (err) throw err;
        console.log("Successfully added role to DB");
        init();
      };

      connection.query(addRoleQuery, onAddRole);
    };

    connection.query(queryDepartments, onQuery);
  }

  if (action === "addEmployee") {
    const queryRoles = "SELECT * FROM role";
    const queryManagers = `
    SELECT employee.id, employee.first_name, employee.last_name FROM employee
    INNER JOIN (SELECT DISTINCT(manager_id) FROM company_db.employee WHERE manager_id IS NOT NULL) as manager
    on employee.id = manager.manager_id
    `;

    const onQuery = async (err, rows) => {
      if (err) throw err;
      const [roles, managers] = rows;

      const roleChoices = roles.map((role) => {
        return {
          name: role.title,
          value: role.id,
          short: role.title,
        };
      });

      const managerChoices = managers.map((manager) => {
        return {
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.id,
          short: `${manager.first_name} ${manager.last_name}`,
        };
      });

      const questions = [
        {
          message: "What is your first name?",
          name: "firstName",
          type: "input",
        },
        {
          message: "What is your last name?",
          name: "lastName",
          type: "input",
        },
        {
          message: "Select a role:",
          name: "roleId",
          type: "list",
          choices: roleChoices,
        },
        {
          message: "Do you want to select a manager?",
          name: "manager",
          type: "confirm",
        },
        {
          message: "Select manager:",
          name: "managerId",
          type: "list",
          choices: managerChoices,
          when: (answers) => {
            return answers.manager;
          },
        },
      ];

      const answers = await inquirer.prompt(questions);

      const addEmployeeQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${
        answers.firstName
      }", "${answers.lastName}", ${answers.roleId}, ${
        answers.managerId || null
      })`;

      const onEmployeeAddQuery = (err) => {
        if (err) throw err;
        console.log("Successfully added employee to DB");
        init();
      };

      connection.query(addEmployeeQuery, onEmployeeAddQuery);
    };

    connection.query(`${queryRoles}; ${queryManagers}`, onQuery);
  }

  if (action === "removeEmployee") {
    const allEmployeesQuery = "SELECT * FROM employee";

    const onAllEmployeesQuery = async (err, employees) => {
      if (err) throw err;

      const choices = employees.map((employee) => {
        return {
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
          short: `${employee.first_name} ${employee.last_name}`,
        };
      });

      const questions = [
        {
          message: "Select an employee:",
          name: "employeeId",
          type: "list",
          choices,
        },
      ];

      const { employeeId } = await inquirer.prompt(questions);

      const deleteEmployeeQuery = `DELETE FROM employee WHERE id=${employeeId}`;

      const onDeleteEmployeeQuery = (err) => {
        if (err) throw err;
        console.log("Deleted employee successfully from DB");
        init();
      };

      connection.query(deleteEmployeeQuery, onDeleteEmployeeQuery);
    };

    connection.query(allEmployeesQuery, onAllEmployeesQuery);
  }

  if (action === "end") {
    process.exit();
  }
};

const onConnect = () => {
  console.log("Connected to the DB!!");

  init();
};

connection.connect(onConnect);
