-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.pessoa (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  nome character varying NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  CONSTRAINT pessoa_pkey PRIMARY KEY (id)
);
CREATE TABLE public.dupla_habitual (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  pessoa_id_1 integer NOT NULL,
  pessoa_id_2 integer NOT NULL,
  CONSTRAINT dupla_habitual_pkey PRIMARY KEY (id),
  CONSTRAINT dupla_habitual_pessoa_id_1_fkey FOREIGN KEY (pessoa_id_1) REFERENCES public.pessoa(id),
  CONSTRAINT dupla_habitual_pessoa_id_2_fkey FOREIGN KEY (pessoa_id_2) REFERENCES public.pessoa(id)
);