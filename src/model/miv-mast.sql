-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:8889
-- Tiempo de generación: 10-02-2022 a las 10:20:02
-- Versión del servidor: 5.7.26
-- Versión de PHP: 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `miv-mast`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `analytics`
--

CREATE TABLE `analytics` (
  `id_analytic` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `courses`
--

CREATE TABLE `courses` (
  `id_course` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `courses`
--

INSERT INTO `courses` (`id_course`, `name`, `status`, `created`) VALUES
(1, 'Evento Online Radiesse', 1, '2022-02-10 01:20:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `surveys`
--

CREATE TABLE `surveys` (
  `id_survey` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `question_1` varchar(255) NOT NULL,
  `question_2` varchar(255) NOT NULL,
  `question_3` varchar(255) NOT NULL,
  `question_4` varchar(255) NOT NULL,
  `question_5` varchar(255) NOT NULL,
  `question_6` varchar(255) NOT NULL,
  `question_7` varchar(255) NOT NULL,
  `question_8` varchar(255) DEFAULT NULL,
  `question_9` varchar(255) NOT NULL,
  `question_10` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tanger_live`
--

CREATE TABLE `tanger_live` (
  `idtanger_live` int(11) NOT NULL,
  `comentario` text,
  `estado` int(11) NOT NULL DEFAULT '0',
  `mostrada` int(11) DEFAULT '0',
  `presentacion` int(11) DEFAULT '1',
  `idioma` varchar(255) NOT NULL,
  `uid` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tracking`
--

CREATE TABLE `tracking` (
  `id_tracking` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `current` float NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `specialty` varchar(255) DEFAULT NULL,
  `cedula` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `passdefault` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `voto_pregunta`
--

CREATE TABLE `voto_pregunta` (
  `idvoto_pregunta` int(11) NOT NULL,
  `nombre` varchar(500) DEFAULT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `estado` int(11) DEFAULT '0',
  `breakout` int(11) DEFAULT '0',
  `presentacion` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `voto_respondieron`
--

CREATE TABLE `voto_respondieron` (
  `idvoto_pregunta` int(11) NOT NULL,
  `idrespuesta` int(11) NOT NULL,
  `puntos` int(11) NOT NULL DEFAULT '0',
  `correcto` int(11) NOT NULL DEFAULT '0',
  `uid` int(11) NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `voto_respuesta`
--

CREATE TABLE `voto_respuesta` (
  `idvoto_respuesta` int(11) NOT NULL,
  `idvoto_pregunta` int(11) NOT NULL,
  `opcion` varchar(500) DEFAULT NULL,
  `respuesta` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `analytics`
--
ALTER TABLE `analytics`
  ADD PRIMARY KEY (`id_analytic`);

--
-- Indices de la tabla `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id_course`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `surveys`
--
ALTER TABLE `surveys`
  ADD PRIMARY KEY (`id_survey`);

--
-- Indices de la tabla `tanger_live`
--
ALTER TABLE `tanger_live`
  ADD PRIMARY KEY (`idtanger_live`);

--
-- Indices de la tabla `tracking`
--
ALTER TABLE `tracking`
  ADD PRIMARY KEY (`id_tracking`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- Indices de la tabla `voto_pregunta`
--
ALTER TABLE `voto_pregunta`
  ADD PRIMARY KEY (`idvoto_pregunta`);

--
-- Indices de la tabla `voto_respondieron`
--
ALTER TABLE `voto_respondieron`
  ADD KEY `fk_algo` (`idvoto_pregunta`);

--
-- Indices de la tabla `voto_respuesta`
--
ALTER TABLE `voto_respuesta`
  ADD PRIMARY KEY (`idvoto_respuesta`),
  ADD KEY `fk_voto_respuesta_voto_pregunta_idx` (`idvoto_pregunta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `analytics`
--
ALTER TABLE `analytics`
  MODIFY `id_analytic` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `courses`
--
ALTER TABLE `courses`
  MODIFY `id_course` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `surveys`
--
ALTER TABLE `surveys`
  MODIFY `id_survey` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tanger_live`
--
ALTER TABLE `tanger_live`
  MODIFY `idtanger_live` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tracking`
--
ALTER TABLE `tracking`
  MODIFY `id_tracking` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `voto_pregunta`
--
ALTER TABLE `voto_pregunta`
  MODIFY `idvoto_pregunta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `voto_respuesta`
--
ALTER TABLE `voto_respuesta`
  MODIFY `idvoto_respuesta` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `voto_respondieron`
--
ALTER TABLE `voto_respondieron`
  ADD CONSTRAINT `fk_algo` FOREIGN KEY (`idvoto_pregunta`) REFERENCES `voto_pregunta` (`idvoto_pregunta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `voto_respuesta`
--
ALTER TABLE `voto_respuesta`
  ADD CONSTRAINT `fk_voto_respuesta_voto_pregunta` FOREIGN KEY (`idvoto_pregunta`) REFERENCES `voto_pregunta` (`idvoto_pregunta`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
