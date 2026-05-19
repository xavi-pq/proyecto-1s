-- Script para crear las tablas de Empleados, Clientes y Permisos en Supabase
-- Ejecuta este script en el Editor SQL de Supabase

-- 1. Crear tabla de Permisos
CREATE TABLE IF NOT EXISTS public.permisos ( 
  id_permiso bigint GENERATED ALWAYS AS IDENTITY NOT NULL, 
  rol character varying NOT NULL UNIQUE, 
  permisos jsonb NOT NULL DEFAULT '{}', 
  descripcion text, 
  CONSTRAINT permisos_pkey PRIMARY KEY (id_permiso) 
); 

-- 2. Insertar roles por defecto 
INSERT INTO public.permisos (rol, permisos, descripcion) VALUES 
('administrador', 
 '{"ver_empleados": true, "editar_empleados": true, "ver_clientes": true, "crear_ventas": true, "ver_reportes": true, "administrar_sistema": true}'::jsonb, 
 'Acceso total'), 
('cajero', 
 '{"ver_clientes": true, "crear_ventas": true, "ver_sesiones": true, "finalizar_sesiones": true, "ver_productos": true}'::jsonb, 
 'Cajero normal'), 
('mesero', 
 '{"ver_clientes": true, "crear_ventas": true, "ver_productos": true}'::jsonb, 
 'Solo ventas básicas') 
ON CONFLICT (rol) DO NOTHING; 

-- 3. Crear Tabla de Empleados (Actualizada con FK a permisos)
CREATE TABLE IF NOT EXISTS public.empleados (
    id_empleado SERIAL PRIMARY KEY,
    nombre_empleado VARCHAR(100) NOT NULL,
    apellido_empleado VARCHAR(100) NOT NULL,
    celular VARCHAR(20),
    pin VARCHAR(6),
    email VARCHAR(100) UNIQUE NOT NULL,
    tipo_empleado VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT empleados_tipo_empleado_fkey FOREIGN KEY (tipo_empleado) REFERENCES public.permisos(rol)
);

-- 4. Tabla de Clientes
CREATE TABLE IF NOT EXISTS public.clientes (
    id_cliente INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    celular VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS
ALTER TABLE public.empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permisos ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para Permisos
CREATE POLICY "Permitir lectura a usuarios autenticados" ON public.permisos
    FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas de seguridad para Empleados
CREATE POLICY "Permitir lectura a usuarios autenticados" ON public.empleados
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserción a usuarios autenticados" ON public.empleados
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir actualización a usuarios autenticados" ON public.empleados
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir eliminación a usuarios autenticados" ON public.empleados
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas de seguridad para Clientes
CREATE POLICY "Permitir lectura a usuarios autenticados" ON public.clientes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserción a usuarios autenticados" ON public.clientes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir actualización a usuarios autenticados" ON public.clientes
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir eliminación a usuarios autenticados" ON public.clientes
    FOR DELETE USING (auth.role() = 'authenticated');
