--
-- PostgreSQL database dump
--

\restrict goWfVNkh5m7EMvdX14Fa0KqNmcGGJtk2KddeRg3vDnSW90BWae8bQJmOfnSOgO9

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-11-24 17:06:19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16481)
-- Name: author; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.author (
    id integer NOT NULL,
    name character varying(50)
);


ALTER TABLE public.author OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16480)
-- Name: author_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.author_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.author_id_seq OWNER TO postgres;

--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 221
-- Name: author_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.author_id_seq OWNED BY public.author.id;


--
-- TOC entry 4865 (class 2604 OID 16484)
-- Name: author id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.author ALTER COLUMN id SET DEFAULT nextval('public.author_id_seq'::regclass);


--
-- TOC entry 5018 (class 0 OID 16481)
-- Dependencies: 222
-- Data for Name: author; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.author (id, name) FROM stdin;
22	Harry potter
23	Jon snow
24	test
26	name
\.


--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 221
-- Name: author_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.author_id_seq', 30, true);


--
-- TOC entry 4867 (class 2606 OID 16489)
-- Name: author author_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_name_key UNIQUE (name);


--
-- TOC entry 4869 (class 2606 OID 16487)
-- Name: author author_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_pkey PRIMARY KEY (id);


-- Completed on 2025-11-24 17:06:19

--
-- PostgreSQL database dump complete
--

\unrestrict goWfVNkh5m7EMvdX14Fa0KqNmcGGJtk2KddeRg3vDnSW90BWae8bQJmOfnSOgO9





--
-- PostgreSQL database dump
--

\restrict E0pACLswmWH17ALkcjnnJn7IAlZ1KUeRT6FQlbyRbpEhRXHVze4mccLEidY05vI

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-11-24 17:07:27

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16491)
-- Name: book; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book (
    id integer NOT NULL,
    name character varying(50),
    "authorId" integer
);


ALTER TABLE public.book OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16490)
-- Name: book_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.book_id_seq OWNER TO postgres;

--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 223
-- Name: book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.book_id_seq OWNED BY public.book.id;


--
-- TOC entry 4865 (class 2604 OID 16494)
-- Name: book id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book ALTER COLUMN id SET DEFAULT nextval('public.book_id_seq'::regclass);


--
-- TOC entry 5019 (class 0 OID 16491)
-- Dependencies: 224
-- Data for Name: book; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book (id, name, "authorId") FROM stdin;
23	test book	22
21	Harry potter and the chamber secrets	22
22	Game of throne	23
\.


--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 223
-- Name: book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.book_id_seq', 23, true);


--
-- TOC entry 4867 (class 2606 OID 16499)
-- Name: book book_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_name_key UNIQUE (name);


--
-- TOC entry 4869 (class 2606 OID 16497)
-- Name: book book_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_pkey PRIMARY KEY (id);


--
-- TOC entry 4870 (class 2606 OID 16500)
-- Name: book book_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_author_id_fkey FOREIGN KEY ("authorId") REFERENCES public.author(id) ON DELETE CASCADE;


-- Completed on 2025-11-24 17:07:27

--
-- PostgreSQL database dump complete
--

\unrestrict E0pACLswmWH17ALkcjnnJn7IAlZ1KUeRT6FQlbyRbpEhRXHVze4mccLEidY05vI

