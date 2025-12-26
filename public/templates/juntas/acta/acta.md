{acta_label}

En la ciudad de {ciudad}, siendo las {hours} horas del {date}, se reunieron en {direccion}, los siguientes accionistas de {nombre_empresa} (la "Sociedad"):

{#asistencia_lista}
● {texto_asistencia}
{/asistencia_lista}

Total: {total_acciones} acciones con derecho a voto...

Quórum y apertura
{#is_universal}
...
{/is_universal}

Presidencia y secretaría
Actuó en la presidencia de la junta {presidente_junta}...

Agenda
{#agenda}
{numero}. {titulo}
{/agenda}

Desarrollo de la junta

{#puntos_acuerdo}
{#tipo == "aporte_dinerario"}
{numero}. {titulo}

La presidencia dio inicio a la junta manifestando...

{#votacion.cumple_votos}
Acuerdos: Luego de una breve deliberación, se acordó, con el {votacion.porcentaje}%, lo siguiente:

i. Aumentar el capital social...

{#datos.aportantes}
{nombre}
{#aportes}
S/{aporte_soles} - {tipo_accion} - {cantidad_acciones} acciones
{/aportes}
{/datos.aportantes}
{/votacion.cumple_votos}

{#votacion.no_cumple_votos}
Acuerdos: Luego de la deliberación... no se cuenta con los votos suficientes...
{/votacion.no_cumple_votos}
{/tipo == "aporte_dinerario"}

{#tipo == "capitalizacion_creditos"}
{numero}. {titulo}

La presidencia dio inicio a la junta manifestando...

{#votacion.cumple_votos}
Acuerdos: Luego de una breve deliberación...

{#datos.aportantes}
{nombre}
{#aportes}
S/{aporte_soles} - {cantidad_acciones} acciones
{/aportes}
{/datos.aportantes}
{/votacion.cumple_votos}
{/tipo == "capitalizacion_creditos"}

{#tipo == "nombramiento_directores"}
{numero}. {titulo}

La presidencia manifestó que era necesario...

{#votacion.cumple_votos}
Acuerdos: Luego de una breve deliberación...

{#datos.directores}
I. Designar en el cargo de director a {nombre_director}, con {tipo_doc} {numero_doc}.
{/datos.directores}
{/votacion.cumple_votos}
{/tipo == "nombramiento_directores"}

{#tipo == "remocion_directores"}
{numero}. {titulo}

La presidencia manifestó que era conveniente...

{#votacion.cumple_votos}
Acuerdos: Luego de una breve deliberación...

{#datos.directores_removidos}
I. Remover del cargo de director a {nombre_director}, con {tipo_doc} {numero_doc}...
{/datos.directores_removidos}
{/votacion.cumple_votos}
{/tipo == "remocion_directores"}

{#tipo == "nombramiento_gerente"}
{numero}. {titulo}

La presidencia manifestó que era necesario...

{#votacion.cumple_votos}
Acuerdos: Luego de una breve deliberación...

i. Nombrar en el cargo de {datos.tipo_gerente} a {datos.nombre_gerente}, con {datos.tipo_doc} {datos.numero_doc}.
ii. La vigencia de la designación efectuada es {datos.tiempo_vigencia}.
{/votacion.cumple_votos}
{/tipo == "nombramiento_gerente"}

{#tipo == "remocion_gerente"}
{numero}. {titulo}

La presidencia manifestó que era conveniente...

{#votacion.cumple_votos}
Acuerdos: Luego de una breve deliberación...

Remover del cargo de {datos.tipo_gerente} a {datos.nombre_gerente}, con {datos.tipo_doc} {datos.numero_doc}...
{/votacion.cumple_votos}
{/tipo == "remocion_gerente"}

{#tipo == "nombramiento_apoderados"}
{numero}. {titulo}

La presidencia manifestó que era necesario...

{#votacion.cumple_votos}
Acuerdos: Luego de una breve deliberación...

{#datos.apoderados}
I. Nombrar en el cargo de apoderado a {nombre_apoderado}, con {tipo_doc} {numero_doc}.
{/datos.apoderados}
{/votacion.cumple_votos}
{/tipo == "nombramiento_apoderados"}

{#tipo == "remocion_apoderados"}
{numero}. {titulo}

La presidencia manifestó que era conveniente...

{#votacion.cumple_votos}
Acuerdos: Luego de una breve deliberación...

{#datos.apoderados_removidos}
I. Remover del cargo de apoderado a {nombre_apoderado}, con {tipo_doc} {numero_doc}...
{/datos.apoderados_removidos}
{/votacion.cumple_votos}
{/tipo == "remocion_apoderados"}

{#tipo == "gestion_social"}
{numero}. {titulo}

La presidencia inició la sesión dando la bienvenida...

{#votacion.cumple_votos}
Acuerdos: Luego de una breve deliberación...

Aprobar los resultados económicos del ejercicio y la gestión social, recogidos en los estados financieros...
{/votacion.cumple_votos}
{/tipo == "gestion_social"}

{#tipo == "aplicacion_resultados"}
{numero}. {titulo}

La presidencia señaló que, como era de conocimiento...

{#votacion.cumple_votos}
Acuerdos: Luego de la deliberación...

Los accionistas decidieron aprobar la distribución de dividendos por la suma de {datos.suma_dividendos} ({datos.suma_dividendos_palabras}).
{/votacion.cumple_votos}
{/tipo == "aplicacion_resultados"}

{#tipo == "designacion_auditores"}
{numero}. {titulo}

El presidente indicó que era necesario...

{#datos.delegar_en_directorio}
{#votacion.cumple_votos}
Acuerdos: Luego de la deliberación... se acordó delegar en el directorio la designación de los auditores externos...
{/votacion.cumple_votos}
{/datos.delegar_en_directorio}

{#datos.no_delegar_en_directorio}
{#votacion.cumple_votos}
Acuerdos: Luego de la deliberación...

Designar como auditores externos de la Sociedad a {datos.nombre_auditores}.
{/votacion.cumple_votos}
{/datos.no_delegar_en_directorio}
{/tipo == "designacion_auditores"}

{#tipo == "modificacion_estatuto"}
{numero}. {titulo}

La presidencia continuó la sesión precisando que...

{#votacion.cumple_votos}
Acuerdos: Luego de una breve deliberación...

"ARTÍCULO [Número de artículo]: El capital social asciende al monto de S/ {datos.total_capital} ({datos.total_capital_palabras})..."
{/votacion.cumple_votos}
{/tipo == "modificacion_estatuto"}

{#tipo == "otorgamiento_facultades"}
{numero}. {titulo}

Finalmente, la presidencia manifestó que...

{#votacion.cumple_votos}
Acuerdos: Luego de una breve deliberación...

Autorizar a las personas de la siguiente lista...

{#votacion.accionistas_afavor}
I. {nombres}, quien cuenta con {tipoDoc} No. {numeroDoc}.
{/votacion.accionistas_afavor}
{/votacion.cumple_votos}
{/tipo == "otorgamiento_facultades"}

{/puntos_acuerdo}

Fin de la sesión:

Siendo las {hora_acta} horas y no habiendo otro asunto qué tratar...

---

{presidente_junta}
Presidencia ******\*\*\*\*******\_******\*\*\*\*******
{secretario_junta}
Secretaría

{#is_universal}
{#asistentes_firmas}

---

{nombre_accionista}
{/asistentes_firmas}
{/is_universal}
