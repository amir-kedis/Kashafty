--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: ActivityType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ActivityType" AS ENUM (
    'entertainment',
    'rowing',
    'camping',
    'wildCooking',
    'scouting',
    'volunteering',
    'other'
);


--
-- Name: AspectCategory; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AspectCategory" AS ENUM (
    'scoutingSkills',
    'behaviour',
    'participation',
    'exams',
    'other'
);


--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'absent',
    'execused',
    'termExecused',
    'attended'
);


--
-- Name: CaptainType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CaptainType" AS ENUM (
    'general',
    'unit',
    'regular'
);


--
-- Name: Days; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Days" AS ENUM (
    'sat',
    'sun',
    'mon',
    'tue',
    'wed',
    'thu',
    'fri'
);


--
-- Name: FinanceItemType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."FinanceItemType" AS ENUM (
    'income',
    'expense'
);


--
-- Name: Gender; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Gender" AS ENUM (
    'male',
    'female'
);


--
-- Name: NotificationStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."NotificationStatus" AS ENUM (
    'read',
    'unread',
    'archived'
);


--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."NotificationType" AS ENUM (
    'attendance',
    'report',
    'financeItemCreated',
    'other'
);


--
-- Name: Activity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Activity" (
    "activityId" integer NOT NULL,
    place character varying(255),
    "weekNumber" integer NOT NULL,
    "termNumber" integer NOT NULL,
    day public."Days" NOT NULL,
    type public."ActivityType" NOT NULL
);


--
-- Name: ActivityAttendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ActivityAttendance" (
    "scoutId" integer NOT NULL,
    "activityId" integer NOT NULL,
    score integer,
    "attendanceStatus" public."AttendanceStatus" NOT NULL
);


--
-- Name: ActivityGuidance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ActivityGuidance" (
    "activityId" integer NOT NULL,
    "captainId" integer NOT NULL
);


--
-- Name: ActivitySectorParticipation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ActivitySectorParticipation" (
    "activityId" integer NOT NULL,
    "sectorBaseName" character varying NOT NULL,
    "sectorSuffixName" character varying NOT NULL
);


--
-- Name: Activity_activityId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Activity_activityId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Activity_activityId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Activity_activityId_seq" OWNED BY public."Activity"."activityId";


--
-- Name: Aspect; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Aspect" (
    "aspectId" integer NOT NULL,
    name character varying(255) NOT NULL,
    "sectorBaseName" character varying(255) NOT NULL,
    "sectorSuffixName" character varying(255) NOT NULL,
    category public."AspectCategory" NOT NULL
);


--
-- Name: Aspect_aspectId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Aspect_aspectId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Aspect_aspectId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Aspect_aspectId_seq" OWNED BY public."Aspect"."aspectId";


--
-- Name: Captain; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Captain" (
    "captainId" integer NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "middleName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    "phoneNumber" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "rSectorBaseName" character varying(255),
    "rSectorSuffixName" character varying(255),
    gender public."Gender" NOT NULL,
    type public."CaptainType" NOT NULL
);


--
-- Name: CaptainAttendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CaptainAttendance" (
    "captainId" integer NOT NULL,
    "weekNumber" integer NOT NULL,
    "termNumber" integer NOT NULL,
    "attendanceStatus" public."AttendanceStatus" NOT NULL
);


--
-- Name: Captain_captainId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Captain_captainId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Captain_captainId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Captain_captainId_seq" OWNED BY public."Captain"."captainId";


--
-- Name: FinanceItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FinanceItem" (
    "itemId" integer NOT NULL,
    value double precision NOT NULL,
    "timestamp" timestamp(0) without time zone NOT NULL,
    type public."FinanceItemType" NOT NULL
);


--
-- Name: FinanceItem_itemId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."FinanceItem_itemId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: FinanceItem_itemId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."FinanceItem_itemId_seq" OWNED BY public."FinanceItem"."itemId";


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notification" (
    "notificationId" integer NOT NULL,
    "timestamp" timestamp(0) without time zone NOT NULL,
    message character varying(255) NOT NULL,
    "contentType" public."NotificationType" NOT NULL
);


--
-- Name: Notification_NotificationId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Notification_NotificationId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Notification_NotificationId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Notification_NotificationId_seq" OWNED BY public."Notification"."notificationId";


--
-- Name: OtherItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."OtherItem" (
    description text NOT NULL,
    "itemId" bigint NOT NULL,
    "generalCaptainId" integer
);


--
-- Name: RecieveNotification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RecieveNotification" (
    "notificationId" integer NOT NULL,
    "captainId" integer NOT NULL,
    status character varying(255)
);


--
-- Name: Report; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Report" (
    "reportId" integer NOT NULL,
    info text NOT NULL,
    date date NOT NULL,
    "captainId" integer,
    "scoutId" integer NOT NULL
);


--
-- Name: Report_captainId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Report_captainId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Report_captainId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Report_captainId_seq" OWNED BY public."Report"."captainId";


--
-- Name: Report_reportId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Report_reportId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Report_reportId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Report_reportId_seq" OWNED BY public."Report"."reportId";


--
-- Name: Scout; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Scout" (
    "scoutId" integer NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "middleName" character varying(255) NOT NULL,
    "lastName" character varying(255),
    expelled boolean DEFAULT false NOT NULL,
    "sectorBaseName" character varying(255),
    "sectorSuffixName" character varying(255),
    gender public."Gender"
);


--
-- Name: ScoutAttendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ScoutAttendance" (
    "scoutId" integer NOT NULL,
    "weekNumber" integer NOT NULL,
    "termNumber" integer NOT NULL,
    "attendanceStatus" public."AttendanceStatus" NOT NULL
);


--
-- Name: ScoutProfile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ScoutProfile" (
    "birthCertificate" character varying(255),
    "birthDate" date,
    "enrollDate" date,
    photo character varying(255),
    "scoutId" integer NOT NULL,
    "schoolGrade" integer
);


--
-- Name: ScoutScore; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ScoutScore" (
    "scoutId" integer NOT NULL,
    "aspectId" integer NOT NULL,
    score integer NOT NULL,
    "timestamp" timestamp without time zone NOT NULL
);


--
-- Name: Scout_scoutId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Scout_scoutId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Scout_scoutId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Scout_scoutId_seq" OWNED BY public."Scout"."scoutId";


--
-- Name: Sector; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Sector" (
    "baseName" character varying(255) NOT NULL,
    "suffixName" character varying(255) NOT NULL,
    "unitCaptainId" integer
);


--
-- Name: Session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Session" (
    "sessionId" integer NOT NULL,
    title character varying(255) NOT NULL,
    "documentURL" character varying(255),
    "captainId" integer,
    "weekNumber" integer NOT NULL,
    "termNumber" integer NOT NULL
);


--
-- Name: SessionSectorParticipation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SessionSectorParticipation" (
    "sessionID" integer NOT NULL,
    "sectorBaseName" character varying NOT NULL,
    "sectorSuffixName" character varying NOT NULL
);


--
-- Name: Session_sessionId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Session_sessionId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Session_sessionId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Session_sessionId_seq" OWNED BY public."Session"."sessionId";


--
-- Name: Subscription; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Subscription" (
    "itemId" integer NOT NULL,
    "sectorBaseName" character varying(255),
    "sectorSuffixName" character varying(255),
    "weekNumber" integer NOT NULL,
    "termNumber" integer NOT NULL
);


--
-- Name: Subscription_itemId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Subscription_itemId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Subscription_itemId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Subscription_itemId_seq" OWNED BY public."Subscription"."itemId";


--
-- Name: Term; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Term" (
    "termNumber" integer NOT NULL,
    "termName" character varying(255),
    "startDate" date NOT NULL,
    "endDate" date NOT NULL
);


--
-- Name: Term_termNumber_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Term_termNumber_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Term_termNumber_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Term_termNumber_seq" OWNED BY public."Term"."termNumber";


--
-- Name: Week; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Week" (
    "weekNumber" integer NOT NULL,
    cancelled boolean DEFAULT false NOT NULL,
    "startDate" date NOT NULL,
    "termNumber" integer NOT NULL
);


--
-- Name: Activity activityId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Activity" ALTER COLUMN "activityId" SET DEFAULT nextval('public."Activity_activityId_seq"'::regclass);


--
-- Name: Aspect aspectId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Aspect" ALTER COLUMN "aspectId" SET DEFAULT nextval('public."Aspect_aspectId_seq"'::regclass);


--
-- Name: Captain captainId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Captain" ALTER COLUMN "captainId" SET DEFAULT nextval('public."Captain_captainId_seq"'::regclass);


--
-- Name: FinanceItem itemId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FinanceItem" ALTER COLUMN "itemId" SET DEFAULT nextval('public."FinanceItem_itemId_seq"'::regclass);


--
-- Name: Notification notificationId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification" ALTER COLUMN "notificationId" SET DEFAULT nextval('public."Notification_NotificationId_seq"'::regclass);


--
-- Name: Report reportId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Report" ALTER COLUMN "reportId" SET DEFAULT nextval('public."Report_reportId_seq"'::regclass);


--
-- Name: Report captainId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Report" ALTER COLUMN "captainId" SET DEFAULT nextval('public."Report_captainId_seq"'::regclass);


--
-- Name: Scout scoutId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Scout" ALTER COLUMN "scoutId" SET DEFAULT nextval('public."Scout_scoutId_seq"'::regclass);


--
-- Name: Session sessionId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session" ALTER COLUMN "sessionId" SET DEFAULT nextval('public."Session_sessionId_seq"'::regclass);


--
-- Name: Subscription itemId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subscription" ALTER COLUMN "itemId" SET DEFAULT nextval('public."Subscription_itemId_seq"'::regclass);


--
-- Name: Term termNumber; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Term" ALTER COLUMN "termNumber" SET DEFAULT nextval('public."Term_termNumber_seq"'::regclass);


--
-- Data for Name: Activity; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: ActivityAttendance; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: ActivityGuidance; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: ActivitySectorParticipation; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Aspect; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Captain; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Captain" ("captainId", "firstName", "middleName", "lastName", "phoneNumber", email, password, "rSectorBaseName", "rSectorSuffixName", gender, type) VALUES (1, 'amir', 'anwar', 'test', '01009648948', 'amir.kedis@gmail.com', '$2a$10$AHnSM3cmrKJIgB9dLLEJu./aEC7AxQG7xYF7MPqxEY5dYF7UM4Pz.', NULL, NULL, 'male', 'general');
INSERT INTO public."Captain" ("captainId", "firstName", "middleName", "lastName", "phoneNumber", email, password, "rSectorBaseName", "rSectorSuffixName", gender, type) VALUES (3, 'amir', 'anwar', 'test', '01221461992', 'regular@gmail.com', '$2a$10$Vp2arlrpJypUg2TpDmZcie76qiWtKnWgMhLDxWKRVfTp7OV7aDnaq', NULL, NULL, 'male', 'general');
INSERT INTO public."Captain" ("captainId", "firstName", "middleName", "lastName", "phoneNumber", email, password, "rSectorBaseName", "rSectorSuffixName", gender, type) VALUES (4, 'aa', 'bb', 'cc', '01000000000', 'reg@gmail.com', '$2a$10$m.QeJBub9gcfsdySPF74fOPY5bHH/Bl9OnOPHd3VJF9/svDfYHiO2', 'test', 'test', 'male', 'regular');


--
-- Data for Name: CaptainAttendance; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: FinanceItem; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."FinanceItem" ("itemId", value, "timestamp", type) VALUES (1, 0, '2024-07-02 12:24:51', 'income');
INSERT INTO public."FinanceItem" ("itemId", value, "timestamp", type) VALUES (2, 1000, '2024-07-02 13:04:00', 'income');


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Notification" ("notificationId", "timestamp", message, "contentType") VALUES (1, '2024-07-02 07:17:49', 'testr', 'other');
INSERT INTO public."Notification" ("notificationId", "timestamp", message, "contentType") VALUES (2, '2024-07-02 07:18:15', 'asdfsdf', 'other');
INSERT INTO public."Notification" ("notificationId", "timestamp", message, "contentType") VALUES (3, '2024-07-02 11:54:25', 'test', 'other');
INSERT INTO public."Notification" ("notificationId", "timestamp", message, "contentType") VALUES (4, '2024-07-02 12:47:44', 'test', 'other');
INSERT INTO public."Notification" ("notificationId", "timestamp", message, "contentType") VALUES (5, '2024-07-02 12:51:54', 'test', 'other');


--
-- Data for Name: OtherItem; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."OtherItem" (description, "itemId", "generalCaptainId") VALUES ('12', 2, 3);


--
-- Data for Name: RecieveNotification; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."RecieveNotification" ("notificationId", "captainId", status) VALUES (5, 1, 'unread');
INSERT INTO public."RecieveNotification" ("notificationId", "captainId", status) VALUES (5, 3, 'unread');
INSERT INTO public."RecieveNotification" ("notificationId", "captainId", status) VALUES (5, 4, 'unread');


--
-- Data for Name: Report; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Scout; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Scout" ("scoutId", "firstName", "middleName", "lastName", expelled, "sectorBaseName", "sectorSuffixName", gender) VALUES (2, 'test', 'test', 'tests', false, 'test', 'test', NULL);


--
-- Data for Name: ScoutAttendance; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."ScoutAttendance" ("scoutId", "weekNumber", "termNumber", "attendanceStatus") VALUES (2, 1, 1, 'attended');


--
-- Data for Name: ScoutProfile; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: ScoutScore; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Sector; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Sector" ("baseName", "suffixName", "unitCaptainId") VALUES ('test', 'test', NULL);


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: SessionSectorParticipation; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Subscription" ("itemId", "sectorBaseName", "sectorSuffixName", "weekNumber", "termNumber") VALUES (1, 'test', 'test', 1, 1);


--
-- Data for Name: Term; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Term" ("termNumber", "termName", "startDate", "endDate") VALUES (1, 'test', '2024-07-02', '2024-08-10');


--
-- Data for Name: Week; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Week" ("weekNumber", cancelled, "startDate", "termNumber") VALUES (1, false, '2024-01-07', 1);


--
-- Name: Activity_activityId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Activity_activityId_seq"', 1, false);


--
-- Name: Aspect_aspectId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Aspect_aspectId_seq"', 1, false);


--
-- Name: Captain_captainId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Captain_captainId_seq"', 4, true);


--
-- Name: FinanceItem_itemId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."FinanceItem_itemId_seq"', 2, true);


--
-- Name: Notification_NotificationId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Notification_NotificationId_seq"', 5, true);


--
-- Name: Report_captainId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Report_captainId_seq"', 1, false);


--
-- Name: Report_reportId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Report_reportId_seq"', 1, false);


--
-- Name: Scout_scoutId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Scout_scoutId_seq"', 2, true);


--
-- Name: Session_sessionId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Session_sessionId_seq"', 1, false);


--
-- Name: Subscription_itemId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Subscription_itemId_seq"', 1, false);


--
-- Name: Term_termNumber_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Term_termNumber_seq"', 1, false);


--
-- Name: ActivityAttendance ActivityAttendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ActivityAttendance"
    ADD CONSTRAINT "ActivityAttendance_pkey" PRIMARY KEY ("scoutId", "activityId");


--
-- Name: ActivityGuidance ActivityGuidance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ActivityGuidance"
    ADD CONSTRAINT "ActivityGuidance_pkey" PRIMARY KEY ("activityId", "captainId");


--
-- Name: ActivitySectorParticipation ActivitySectorParticipation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ActivitySectorParticipation"
    ADD CONSTRAINT "ActivitySectorParticipation_pkey" PRIMARY KEY ("activityId", "sectorBaseName", "sectorSuffixName");


--
-- Name: Activity Activity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY ("activityId");


--
-- Name: Aspect Aspect_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Aspect"
    ADD CONSTRAINT "Aspect_pkey" PRIMARY KEY ("aspectId");


--
-- Name: CaptainAttendance CaptainAttendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CaptainAttendance"
    ADD CONSTRAINT "CaptainAttendance_pkey" PRIMARY KEY ("captainId", "weekNumber", "termNumber");


--
-- Name: Captain Captain_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Captain"
    ADD CONSTRAINT "Captain_pkey" PRIMARY KEY ("captainId");


--
-- Name: FinanceItem FinanceItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FinanceItem"
    ADD CONSTRAINT "FinanceItem_pkey" PRIMARY KEY ("itemId");


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationId");


--
-- Name: OtherItem OtherItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OtherItem"
    ADD CONSTRAINT "OtherItem_pkey" PRIMARY KEY ("itemId");


--
-- Name: RecieveNotification RecieveNotification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RecieveNotification"
    ADD CONSTRAINT "RecieveNotification_pkey" PRIMARY KEY ("notificationId", "captainId");


--
-- Name: Report Report_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_pkey" PRIMARY KEY ("reportId");


--
-- Name: ScoutAttendance ScoutAttendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScoutAttendance"
    ADD CONSTRAINT "ScoutAttendance_pkey" PRIMARY KEY ("scoutId", "weekNumber", "termNumber");


--
-- Name: ScoutScore ScoutScore_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScoutScore"
    ADD CONSTRAINT "ScoutScore_pkey" PRIMARY KEY ("scoutId", "aspectId");


--
-- Name: Scout Scout_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Scout"
    ADD CONSTRAINT "Scout_pkey" PRIMARY KEY ("scoutId");


--
-- Name: Sector Sector_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Sector"
    ADD CONSTRAINT "Sector_pkey" PRIMARY KEY ("baseName", "suffixName");


--
-- Name: SessionSectorParticipation SessionSectorParticipation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SessionSectorParticipation"
    ADD CONSTRAINT "SessionSectorParticipation_pkey" PRIMARY KEY ("sessionID", "sectorBaseName", "sectorSuffixName");


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionId");


--
-- Name: Subscription Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY ("itemId");


--
-- Name: Term Term_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Term"
    ADD CONSTRAINT "Term_pkey" PRIMARY KEY ("termNumber");


--
-- Name: Week Week_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Week"
    ADD CONSTRAINT "Week_pkey" PRIMARY KEY ("weekNumber", "termNumber");


--
-- Name: Captain captain_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Captain"
    ADD CONSTRAINT captain_email_unique UNIQUE (email);


--
-- Name: Captain captain_phonenumber_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Captain"
    ADD CONSTRAINT captain_phonenumber_unique UNIQUE ("phoneNumber");


--
-- Name: SessionSectorParticipation SessionParticipation_Sector_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SessionSectorParticipation"
    ADD CONSTRAINT "SessionParticipation_Sector_FK" FOREIGN KEY ("sectorBaseName", "sectorSuffixName") REFERENCES public."Sector"("baseName", "suffixName") ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: SessionSectorParticipation SessionParticipation_Session_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SessionSectorParticipation"
    ADD CONSTRAINT "SessionParticipation_Session_FK" FOREIGN KEY ("sessionID") REFERENCES public."Session"("sessionId") ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: ActivityAttendance activityAttendance_activity_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ActivityAttendance"
    ADD CONSTRAINT "activityAttendance_activity_FK" FOREIGN KEY ("activityId") REFERENCES public."Activity"("activityId") ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: ActivityAttendance activityAttendance_scout_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ActivityAttendance"
    ADD CONSTRAINT "activityAttendance_scout_FK" FOREIGN KEY ("scoutId") REFERENCES public."Scout"("scoutId") ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: ActivityGuidance activityGuidance_activity_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ActivityGuidance"
    ADD CONSTRAINT "activityGuidance_activity_FK" FOREIGN KEY ("activityId") REFERENCES public."Activity"("activityId") ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: ActivityGuidance activityGuidance_captain_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ActivityGuidance"
    ADD CONSTRAINT "activityGuidance_captain_FK" FOREIGN KEY ("captainId") REFERENCES public."Captain"("captainId") ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: ActivitySectorParticipation activityParticipation_activity_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ActivitySectorParticipation"
    ADD CONSTRAINT "activityParticipation_activity_FK" FOREIGN KEY ("activityId") REFERENCES public."Activity"("activityId") ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: ActivitySectorParticipation activityParticipation_sector_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ActivitySectorParticipation"
    ADD CONSTRAINT "activityParticipation_sector_FK" FOREIGN KEY ("sectorBaseName", "sectorSuffixName") REFERENCES public."Sector"("baseName", "suffixName") ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: Activity activity_weeknumber_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "activity_weeknumber_FK" FOREIGN KEY ("weekNumber", "termNumber") REFERENCES public."Week"("weekNumber", "termNumber") ON UPDATE RESTRICT ON DELETE RESTRICT NOT VALID;


--
-- Name: Aspect aspect_sectorName_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Aspect"
    ADD CONSTRAINT "aspect_sectorName_FK" FOREIGN KEY ("sectorBaseName", "sectorSuffixName") REFERENCES public."Sector"("baseName", "suffixName") ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: ScoutAttendance attendance_scout_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScoutAttendance"
    ADD CONSTRAINT "attendance_scout_FK" FOREIGN KEY ("scoutId") REFERENCES public."Scout"("scoutId") ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: ScoutAttendance attendance_week_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScoutAttendance"
    ADD CONSTRAINT "attendance_week_FK" FOREIGN KEY ("weekNumber", "termNumber") REFERENCES public."Week"("weekNumber", "termNumber") ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: CaptainAttendance captainAttendance_regularCaptain_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CaptainAttendance"
    ADD CONSTRAINT "captainAttendance_regularCaptain_FK" FOREIGN KEY ("captainId") REFERENCES public."Captain"("captainId") ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: CaptainAttendance captainAttendance_week_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CaptainAttendance"
    ADD CONSTRAINT "captainAttendance_week_FK" FOREIGN KEY ("weekNumber", "termNumber") REFERENCES public."Week"("weekNumber", "termNumber") ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: Captain captain_sector_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Captain"
    ADD CONSTRAINT "captain_sector_FK" FOREIGN KEY ("rSectorBaseName", "rSectorSuffixName") REFERENCES public."Sector"("baseName", "suffixName") ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;


--
-- Name: OtherItem otherItem_financeItem_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OtherItem"
    ADD CONSTRAINT "otherItem_financeItem_FK" FOREIGN KEY ("itemId") REFERENCES public."FinanceItem"("itemId") ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: OtherItem otherItem_generalCaptain_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OtherItem"
    ADD CONSTRAINT "otherItem_generalCaptain_FK" FOREIGN KEY ("generalCaptainId") REFERENCES public."Captain"("captainId") ON UPDATE RESTRICT ON DELETE SET NULL NOT VALID;


--
-- Name: RecieveNotification recNot_captain_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RecieveNotification"
    ADD CONSTRAINT "recNot_captain_FK" FOREIGN KEY ("captainId") REFERENCES public."Captain"("captainId") ON UPDATE RESTRICT ON DELETE CASCADE NOT VALID;


--
-- Name: RecieveNotification recNot_notification_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RecieveNotification"
    ADD CONSTRAINT "recNot_notification_FK" FOREIGN KEY ("notificationId") REFERENCES public."Notification"("notificationId") ON UPDATE RESTRICT ON DELETE CASCADE NOT VALID;


--
-- Name: Report report_captain_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "report_captain_FK" FOREIGN KEY ("captainId") REFERENCES public."Captain"("captainId") ON UPDATE RESTRICT ON DELETE SET NULL NOT VALID;


--
-- Name: Report report_scout_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "report_scout_FK" FOREIGN KEY ("scoutId") REFERENCES public."Scout"("scoutId") ON UPDATE RESTRICT ON DELETE CASCADE NOT VALID;


--
-- Name: ScoutScore score_aspect_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScoutScore"
    ADD CONSTRAINT "score_aspect_FK" FOREIGN KEY ("aspectId") REFERENCES public."Aspect"("aspectId") ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: ScoutScore score_scout_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScoutScore"
    ADD CONSTRAINT "score_scout_FK" FOREIGN KEY ("scoutId") REFERENCES public."Scout"("scoutId") ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: ScoutProfile scoutProfile_scout_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScoutProfile"
    ADD CONSTRAINT "scoutProfile_scout_FK" FOREIGN KEY ("scoutId") REFERENCES public."Scout"("scoutId") ON UPDATE RESTRICT ON DELETE CASCADE NOT VALID;


--
-- Name: Scout scout_sector_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Scout"
    ADD CONSTRAINT "scout_sector_FK" FOREIGN KEY ("sectorSuffixName", "sectorBaseName") REFERENCES public."Sector"("suffixName", "baseName") ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;


--
-- Name: Sector sector_unitCaptain_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Sector"
    ADD CONSTRAINT "sector_unitCaptain_FK" FOREIGN KEY ("unitCaptainId") REFERENCES public."Captain"("captainId") ON UPDATE RESTRICT ON DELETE SET NULL NOT VALID;


--
-- Name: Session session_captain_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "session_captain_FK" FOREIGN KEY ("captainId") REFERENCES public."Captain"("captainId") ON UPDATE RESTRICT ON DELETE SET NULL NOT VALID;


--
-- Name: Session session_week_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "session_week_FK" FOREIGN KEY ("weekNumber", "termNumber") REFERENCES public."Week"("weekNumber", "termNumber") ON UPDATE RESTRICT ON DELETE RESTRICT NOT VALID;


--
-- Name: Subscription subscription_financeItem_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "subscription_financeItem_FK" FOREIGN KEY ("itemId") REFERENCES public."FinanceItem"("itemId") ON UPDATE RESTRICT ON DELETE CASCADE NOT VALID;


--
-- Name: Subscription subscription_sector_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "subscription_sector_FK" FOREIGN KEY ("sectorBaseName", "sectorSuffixName") REFERENCES public."Sector"("baseName", "suffixName") ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;


--
-- Name: Subscription subscription_week_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "subscription_week_FK" FOREIGN KEY ("weekNumber", "termNumber") REFERENCES public."Week"("weekNumber", "termNumber") ON UPDATE RESTRICT ON DELETE RESTRICT NOT VALID;


--
-- Name: Week week_term_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Week"
    ADD CONSTRAINT "week_term_FK" FOREIGN KEY ("termNumber") REFERENCES public."Term"("termNumber") ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- PostgreSQL database dump complete
--

