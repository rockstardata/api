SELECT id,
       "firstName",
       "lastName",
       email,
       password
FROM public."user"
LIMIT 1000;-- 1. Insertar los roles básicos en la tabla "role"
INSERT INTO "role" (name) VALUES ('user'), ('ceo'), ('admin'), ('superadmin')
ON CONFLICT (name) DO NOTHING;

-- 2. Insertar el usuario SuperAdmin en la tabla "user"
-- La contraseña es 'superadminpassword'
INSERT INTO "user" ("firstName", "lastName", email, password) VALUES
('Super', 'Admin', 'superadmin@test.com', '$2b/d.b9.S9vPzL/eN.fG.I.yG/e.j.k.l.m.n.o.p.q.r.s.t.u.v')
ON CONFLICT (email) DO NOTHING;

-- 3. Insertar una organización de prueba en la tabla "organization"
INSERT INTO "organization" (name) VALUES ('Organización Principal')
ON CONFLICT (name) DO NOTHING;

-- 4. Asignar el rol de SuperAdmin al usuario SuperAdmin dentro de la organización
-- ESTA ES LA FORMA ROBUSTA: Usamos subconsultas para obtener los IDs dinámicamente.
INSERT INTO "organization_user" ("userId", "roleId", "organizationId")
SELECT
    (SELECT id FROM "user" WHERE email = 'superadmin@test.com'),
    (SELECT id FROM "role" WHERE name = 'superadmin'),
    (SELECT id FROM "organization" WHERE name = 'Organización Principal')
-- Solo se inserta si la combinación de usuario y organización no existe ya.
ON CONFLICT ("userId", "organizationId") DO NOTHING;
