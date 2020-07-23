use employee_tracker;
INSERT INTO department
    (name)
VALUES
    ('Engineering')
INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Software Engineer', 150000, 1),
    ('Software Engineer', 120000, 1)
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Kenny', 'TA', 1, NULL),
    ('Suraj', 'V', 1, 1) 