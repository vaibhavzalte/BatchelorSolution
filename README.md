Designed and developed a scalable accommodation platform with advanced filtering, roommate matching, caching (Redis), and map-based discovery using Next.js and Spring Boot.

posts,vaccancies,roommate,rooms,food,mess,study rooms

table:(listings)
id
type
sub_type
primary_id
secondary_id
listings_status
create_time
created_by
update_time
updated_by
payload


Controller
   ↓
DTO (Request)
   ↓
Transformer (type-based)
   ↓
Service
   ↓
Repository
   ↓
DB

--- reverse ---

DB Entity
   ↓
Transformer
   ↓
Response DTO
   ↓
Controller → Client