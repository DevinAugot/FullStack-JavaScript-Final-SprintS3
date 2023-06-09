PGDMP     %    +                {           Auth    15.1    15.1                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            	           1262    17219    Auth    DATABASE     h   CREATE DATABASE "Auth" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE "Auth";
                postgres    false            �            1259    17301    Logins    TABLE     �   CREATE TABLE public."Logins" (
    id integer NOT NULL,
    username character varying(32) NOT NULL,
    password character varying(256) NOT NULL,
    email character varying(128) NOT NULL,
    uuid uuid NOT NULL
);
    DROP TABLE public."Logins";
       public         heap    postgres    false            �            1259    17300    Logins_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Logins_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Logins_id_seq";
       public          postgres    false    215            
           0    0    Logins_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Logins_id_seq" OWNED BY public."Logins".id;
          public          postgres    false    214            o           2604    17304 	   Logins id    DEFAULT     j   ALTER TABLE ONLY public."Logins" ALTER COLUMN id SET DEFAULT nextval('public."Logins_id_seq"'::regclass);
 :   ALTER TABLE public."Logins" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215                      0    17301    Logins 
   TABLE DATA           G   COPY public."Logins" (id, username, password, email, uuid) FROM stdin;
    public          postgres    false    215   �                  0    0    Logins_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Logins_id_seq"', 2, true);
          public          postgres    false    214            q           2606    17306    Logins Logins_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Logins"
    ADD CONSTRAINT "Logins_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Logins" DROP CONSTRAINT "Logins_pkey";
       public            postgres    false    215            s           2606    17308    Logins unique_username 
   CONSTRAINT     W   ALTER TABLE ONLY public."Logins"
    ADD CONSTRAINT unique_username UNIQUE (username);
 B   ALTER TABLE ONLY public."Logins" DROP CONSTRAINT unique_username;
       public            postgres    false    215               �   x�M��R�0��5\���'�vE�Z��-V�M>�R�R@�tz���Wg����"95�]��˨�6���t������%�����4�*�f�T��O
ڞ�6����߶ 4�?0^�g�|��嬁'}L��y��}�Nld�B8
:�˩x��Xn�>��˽����%�i\)~H��˺�rE����'�r�l^�Q���L0��-0��i�#_�
1�����wS���]M�     