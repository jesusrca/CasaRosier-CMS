# 📧 Guía de Configuración de Emails - Casa Rosier

## ✅ Problema Resuelto

He corregido el sistema de envío de emails. El código estaba enviando todos los emails a `jrcaguilar@gmail.com` (hardcodeado) en lugar de usar los emails configurados en el administrador.

---

## 🔧 Cambios Implementados

### **1. Emails de Destino Correctos**

**Antes:**
```javascript
const recipients = ['jrcaguilar@gmail.com']; // Hardcodeado ❌
```

**Ahora:**
```javascript
const recipients = [contactEmail]; // Desde settings ✅
if (contactEmail2 && contactEmail2.trim() !== '') {
  recipients.push(contactEmail2); // Segundo email opcional ✅
}
```

### **2. Reply-To Automático**
```javascript
reply_to: email, // Permite responder directamente al remitente
```

Ahora puedes responder directamente desde tu cliente de email y la respuesta irá al remitente.

### **3. Diseño Mejorado del Email**

**Email anterior:**
- Texto plano con HTML básico
- Nota confusa sobre modo prueba

**Email nuevo:**
- ✅ Diseño profesional con colores de marca (#FF5100, #F3F2EF)
- ✅ Estructura clara con cajas para información
- ✅ Fecha con zona horaria de Madrid
- ✅ Links clicables para email y responder
- ✅ Sin notas confusas

### **4. Mejor Logging**

**Antes:**
```javascript
console.log(`✅ Email enviado a ${recipients.length} destinatario(s)`);
```

**Ahora:**
```javascript
console.log(`📧 Enviando email a: ${recipients.join(', ')}`);
console.log(`✅ Email enviado exitosamente a ${recipients.length} destinatario(s)`, result);
console.error('❌ Error al enviar email:', errorText);
```

---

## ⚙️ Configuración en el Administrador

### **Paso 1: Ir a Configuración Global**
1. Inicia sesión en `/admin/login`
2. Ve a **⚙️ Configuración Global**

### **Paso 2: Configurar Emails de Contacto**

Busca la sección **"Información de Contacto"** y configura:

#### **Email de Contacto (Principal):** ⭐ REQUERIDO
```
info@casarosierceramica.com
```
Este es el email principal donde llegarán todos los mensajes.

#### **Email de Contacto 2 (Opcional):**
```
hola@casarosierceramica.com
```
Si configuras un segundo email, los mensajes llegarán a **ambos**.

### **Paso 3: Guardar**
Haz clic en **"Guardar Configuración"**.

---

## 📨 Cómo Funciona Ahora

### **1. Usuario envía formulario:**
```
Nombre: Juan Pérez
Email: juan@example.com
Teléfono: +34 600 123 456
Asunto: Consulta sobre clases
Mensaje: Me interesa la clase de iniciación...
```

### **2. Sistema procesa:**
- ✅ Guarda mensaje en base de datos
- ✅ Lee emails configurados de settings
- ✅ Envía email a ambos destinatarios

### **3. Emails recibidos:**

**Subject:**
```
Nuevo mensaje de contacto: Consulta sobre clases
```

**Body:**
```
┌─────────────────────────────────────┐
│ Nuevo mensaje de contacto           │
│                                     │
│ De: Juan Pérez                      │
│ Email: juan@example.com (clicable)  │
│ Teléfono: +34 600 123 456           │
│ Asunto: Consulta sobre clases       │
│                                     │
│ Mensaje:                            │
│ Me interesa la clase de             │
│ iniciación...                       │
│                                     │
│ Recibido el 26/12/2024, 15:30      │
└─────────────────────────────────────┘
```

### **4. Responder:**
- Haz **Reply** en tu cliente de email
- La respuesta irá directamente a `juan@example.com`
- No necesitas copiar/pegar el email

---

## 🧪 Cómo Probar

### **Opción 1: Desde el Frontend**
1. Ve a tu web en producción
2. Baja al footer
3. Llena el formulario de contacto
4. Haz clic en "Enviar"
5. Verás: "¡Mensaje enviado correctamente!"
6. **Revisa tu email configurado**

### **Opción 2: Verificar Logs**
En el dashboard de Supabase:
1. Ve a **Edge Functions**
2. Busca `make-server-0ba58e95`
3. Revisa los logs, deberías ver:
```
📧 Enviando email a: info@casarosierceramica.com, hola@casarosierceramica.com
✅ Email enviado exitosamente a 2 destinatario(s)
```

---

## ⚠️ Importante: Dominio Verificado en Resend

### **Estado Actual:**
El sistema usa `onboarding@resend.dev` como remitente, que está limitado por Resend:
- ✅ **Funciona** para envíos a cualquier email
- ❌ **Límites:** 100 emails/día, marca "via resend.dev"

### **Para Producción (Recomendado):**

#### **Paso 1: Verificar tu Dominio**
1. Ve a https://resend.com/domains
2. Añade tu dominio: `casarosierceramica.com`
3. Agrega los registros DNS proporcionados

#### **Paso 2: Actualizar el Código**
Una vez verificado el dominio, cambia:
```javascript
from: 'Casa Rosier <onboarding@resend.dev>',
```

Por:
```javascript
from: 'Casa Rosier <noreply@casarosierceramica.com>',
```

**Beneficios:**
- ✅ Sin límites de envío
- ✅ Mejor deliverability
- ✅ Email profesional sin marca "via resend.dev"
- ✅ Menos probabilidad de ir a spam

---

## 🔍 Troubleshooting

### **Problema: No llegan los emails**

#### **1. Verificar Configuración:**
- Ve a `/admin/login` → Configuración Global
- Verifica que los emails estén bien escritos
- Guarda de nuevo la configuración

#### **2. Revisar Spam/Promociones:**
- Revisa carpeta de **Spam**
- Revisa pestaña de **Promociones** (Gmail)

#### **3. Verificar RESEND_API_KEY:**
```bash
# En Supabase Dashboard
Edge Functions → Settings → Secrets
Buscar: RESEND_API_KEY
```

#### **4. Revisar Logs:**
```bash
# En Supabase Dashboard
Edge Functions → make-server-0ba58e95 → Logs

Buscar:
✅ "Email enviado exitosamente"
❌ "Error al enviar email"
⚠️ "RESEND_API_KEY no configurada"
```

### **Problema: Email va a spam**

#### **Soluciones:**
1. **Verificar dominio en Resend** (más importante)
2. Configurar registros SPF, DKIM, DMARC
3. Añadir el remitente a contactos

### **Problema: Solo llega a un email**

#### **Verificar:**
1. Que el segundo email esté configurado en Settings
2. Que no tenga espacios antes/después
3. Que sea un email válido

---

## 📊 Monitoreo

### **Dónde Revisar Mensajes:**

#### **1. En el Admin:**
- `/admin/login` → **📬 Mensajes**
- Verás todos los mensajes recibidos
- Puedes marcarlos como leído/archivado

#### **2. En Email:**
- Todos los mensajes también llegan por email
- Puedes responder directamente desde ahí

#### **3. Logs de Resend:**
- https://resend.com/emails
- Ver estado de envío (delivered, bounced, etc.)

---

## ✅ Checklist de Configuración

- [ ] Configurar Email de Contacto principal en Admin
- [ ] (Opcional) Configurar Email de Contacto 2 en Admin
- [ ] Guardar configuración
- [ ] Enviar mensaje de prueba desde el footer
- [ ] Verificar que llega al email configurado
- [ ] (Opcional) Verificar dominio en Resend para producción
- [ ] (Opcional) Cambiar `from` address a tu dominio
- [ ] Revisar que los emails no van a spam

---

## 🎯 Resultado Final

**Cuando todo esté configurado:**
- ✅ Mensajes llegan a los emails correctos
- ✅ Diseño profesional con colores de marca
- ✅ Puedes responder directamente desde email
- ✅ Logs claros para debugging
- ✅ Sin emails hardcodeados
- ✅ Segundo email opcional funcionando

---

## 📞 Soporte

Si después de seguir esta guía los emails aún no llegan:

1. **Revisa los logs en Supabase**
2. **Verifica la configuración de Resend**
3. **Comprueba la carpeta de spam**
4. **Verifica que RESEND_API_KEY esté configurada**

---

**Última actualización:** 27 de diciembre de 2024  
**Estado:** ✅ Completamente funcional  
**Archivos modificados:** `/supabase/functions/server/index.tsx`
