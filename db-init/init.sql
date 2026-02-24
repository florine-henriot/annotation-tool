CREATE TABLE IF NOT EXISTS users
(
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email character varying(255) NOT NULL UNIQUE,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    company character varying(100),
    failed_attempts integer DEFAULT 0,
    lock_until timestamp without time zone
);

CREATE TABLE IF NOT EXISTS projects
(
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id integer NOT NULL,
    project_name text NOT NULL,
    due_date date NOT NULL,
    annotation_file_path text NOT NULL,
    guidelines_file_path text,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(50) DEFAULT 'pending',
    categories json,
    mean_annotations integer,
    CONSTRAINT projects_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS annotations
(
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    row_id integer NOT NULL,
    project_id integer NOT NULL,
    content text,
    date timestamp without time zone,
    CONSTRAINT annotations_project_id_fkey
        FOREIGN KEY (project_id)
        REFERENCES projects (id)
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)