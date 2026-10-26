# Image provenance

All 58 editorial photographs were generated for this project with the built-in imagegen tool, including three fresh photographs for the redesigned homepage hero. They depict a fictional camp experience and fictional people. They are not evidence of a real facility, verified staff, or real parent testimonials. No stock photographs or reference-site images were copied. The original hero photo is retained as an unused source asset.

Final optimized assets are stored in `assets/images/home-1/`, `assets/images/programs/`, and `assets/images/editorial/`. Each photo has a full-width WebP plus 480px and 960px responsive variants. Related articles use a text-led composition to avoid repeating editorial photographs.

The Campora mountain-and-sun mark, light/dark wordmarks, SVG favicon, and editable fictional contact map were created as native SVG artwork. PNG favicon variants and the Apple touch icon are included in `assets/images/branding/`.

`scripts/image-manifest.json` records the original generated source paths and final output names. `scripts/import-images.cjs` creates WebP variants using ImageMagick. Website pages reference only files inside the project; the original generation folder is not needed to run the site.

## Prompt set

The common art direction was premium, photorealistic, candid summer camp editorial photography; warm natural light; realistic faces and anatomy; age-appropriate supervised activities; landscape framing; no embedded text, logos, or watermarks. Ivory, navy, and coral clothing accents were requested where appropriate.

The scene specifications below document the final prompt set used with that art direction. File names in the first column refer to `assets/images/editorial/` unless another folder is specified.

| Asset | Scene specification |
| --- | --- |
| `home-1/camp-hero.webp` | A diverse group of children aged 8–11 with an adult counselor exploring a woodland trail, carrying small daypacks and discovering a leaf. |
| `programs/sports.webp` | Children aged 8–11 playing a friendly soccer game with an adult coach on a camp field. |
| `programs/arts.webp` | Children aged 7–9 making colorful clay animals at an outdoor table supervised by an adult instructor. |
| `programs/coding.webp` | Children aged 10–12 building a wheeled robot in a bright workshop with an adult mentor. |
| `programs/swimming.webp` | Children aged 8–11 learning in a shallow pool under close adult swimming instructor supervision. |
| `programs/nature.webp` | Children aged 6–9 examining leaves with an adult naturalist in a sunlit camp garden. |
| `home2-hero.webp` | Children aged 10–12 and an adult counselor exploring a meadow trail, with a wide scenic composition. |
| `home1-story.webp` | Two children aged 8 and 10 doing a cooperative outdoor puzzle with an adult mentor. |
| `home1-gallery-nature.webp` | Children and an adult guide crouching to examine ferns on a woodland path. |
| `home1-gallery-arts.webp` | Children showing handmade clay creatures at an outdoor craft table with a mentor. |
| `home1-gallery-sports.webp` | Children aged 9–12 laughing during a supervised relay race on a grassy field. |
| `home1-safety.webp` | An adult camp counselor greeting a parent and child at an outdoor check-in desk. |
| `about-story.webp` | An adult counselor reading a nature book with three children in a shaded garden. |
| `home2-intro.webp` | A child with a small daypack observing a butterfly garden alongside a watchful counselor. |
| `home2-week-nature.webp` | Children drawing plants in journals at a woodland picnic table with an adult guide. |
| `home2-week-coding.webp` | Two children programming a small robot at a table with adult mentor supervision. |
| `home2-memory.webp` | An eight-year-old child proudly holding a painted wooden birdhouse with an adult instructor. |
| `age-little.webp` | Children aged 4–6 doing supervised paper collage at a camp activity table. |
| `age-creative.webp` | Children aged 7–9 painting at outdoor easels with an adult teacher. |
| `age-skills.webp` | Children aged 10–12 building a cardboard bridge with an adult camp mentor. |
| `age-teen.webp` | Teenagers aged 13–16 planning a nature conservation project with an adult counselor. |
| `programs-help.webp` | An adult counselor talking with a parent and child near a woodland lodge. |
| `safety-story.webp` | An adult counselor helping a child adjust a sun hat beside a water refill station. |
| `blog-feature.webp` | A parent and child packing a small daypack at a sunlit kitchen table before camp. |
| `auth-login.webp` | A parent and child arriving at a welcoming lodge with an adult camp host. |
| `auth-register.webp` | A child with a small daypack walking beside a parent on a sunlit garden path. |
| `auth-recovery.webp` | A peaceful camp picnic table with a daypack, sun hat, water bottle, and leafy background. |
| `detail-sports.webp`, `detail-arts.webp`, `detail-coding.webp`, `detail-swimming.webp`, `detail-nature.webp` | Separate immersive wide views of children participating in each named activity with an attentive adult instructor. Each activity received its own generation request. |
| `parent-sports.webp`, `parent-arts.webp`, `parent-coding.webp`, `parent-swimming.webp`, `parent-nature.webp` | Separate close candid moments of small groups learning each named activity with an adult mentor. Each activity received its own generation request. |
| `home1-sports.webp`, `home1-arts.webp`, `home1-coding.webp` | Separate candid action photographs of children participating in the named supervised camp activity. |
| `blog-first-day.webp` | A child and parent arriving at camp with an adult host. |
| `article-first-day.webp` | A parent and child laying out a sun hat and camp daypack. |
| `blog-creative.webp` | Children making paper sculptures with an adult teacher. |
| `article-creative.webp` | Children painting smooth stones with an adult mentor. |
| `blog-outdoors.webp` | Children looking through magnifying glasses at leaves with an adult naturalist. |
| `article-outdoors.webp` | A counselor pointing out a bird in a tree to children. |
| `blog-water.webp` | Children practicing swimming beside an adult instructor in a shallow pool. |
| `article-water.webp` | An adult swimming instructor teaching a child to float in a shallow pool. |
| `blog-friendship.webp` | Children doing a cooperative obstacle puzzle with a counselor. |
| `article-friendship.webp` | Children building a cardboard fort with an adult counselor. |
| `blog-summer.webp` | Children and adult counselors on a picnic blanket at camp. |
| `article-summer.webp` | An adult counselor leading children along a meadow trail. |
| `mentor-0.webp` | A fictional friendly male sports coach in a navy polo outdoors. |
| `mentor-1.webp` | A fictional friendly female arts instructor in an ivory shirt at a craft studio. |
| `mentor-2.webp` | A fictional robotics teacher with glasses and a light blue shirt in a workshop. |

Generated photographs should remain labeled as illustrative content when used to describe a real service. Replace them with verified facility and staff photography if presenting actual operational claims.

## Redesigned hero: saved files and final prompts

The built-in imagegen tool generated the following new assets, saved locally with 480px and 960px responsive WebP variants:

- `assets/images/home-1/hero-adventure-v2.webp`
- `assets/images/home-1/hero-makers-v2.webp`
- `assets/images/home-1/hero-robotics-v2.webp`

Each prompt began with: “Use case: photorealistic-natural. Asset type: Campora website hero photography.” The remaining prompt text was:

1. **Outdoor adventure:** Wide panoramic candid summer camp photograph. Children aged 8–12 playing a joyful cooperative outdoor field game with a friendly adult counselor on a sunlit meadow. People concentrated in the right two thirds; the left third has softly shaded woodland and open visual space suitable for white website text. Natural documentary photography, rich realistic detail, navy/coral clothing accents, no text, no logos, no watermark. Landscape 16:9 composition.
2. **Creative making:** Premium natural candid summer camp photograph of two children aged 7–10 with an adult arts instructor making a colorful small paper sculpture at a wooden outdoor studio table. Focused happy expressions, close composition, realistic hands, warm natural daylight, no text, logos or watermarks. Landscape composition.
3. **Robotics:** Premium natural candid summer camp photograph of two children aged 10–12 with an adult mentor testing a small wheeled robot at a bright wood workshop table. Realistic faces and hands, navy and muted coral details, warm summer light, no text, logos or watermark. Landscape composition.

## Inner-page hero photographs

Nine additional AI-generated camp scenes were created for the image-led page headers: camp story, activity programs, mixed-age teamwork, morning arrival, safety and care, family packages, nature journals, family enquiries, and a woodland trail. They are stored locally in `assets/images/heroes/` with responsive variants. These depict fictional people and places. The journal scene is shared by journal headers, and the woodland scene is shared by utility pages.

## Libraries and fonts

Two new AI-generated camp-family photographs for login and registration are stored in `assets/images/access/`, with local responsive variants. They show fictional families meeting camp mentors.

Three new AI-generated weekend activity photographs are stored in `assets/images/weekend/`: leaf journaling, cardboard construction, and a family celebrating a handmade project. The cards reveal their related copy on hover or keyboard focus; touch devices display the copy by default.

Three AI-generated fictional parent headshots were added for testimonial avatars in `assets/images/portraits/`. They replace the initial-letter avatars and do not depict real customers.

- Bootstrap 5.3.3: MIT, local distribution in `assets/vendor/bootstrap.min.css`.
- Chart.js 4.4.8: MIT, local distribution in `assets/vendor/chart.umd.min.js`.
- jsPDF 2.5.2: MIT, local distribution in `assets/vendor/jspdf.umd.min.js`.
- Bootstrap Icons: MIT, local font distribution and license in `assets/vendor/bootstrap-icons/`.
- Inter and Manrope: locally hosted Fontsource distributions, with their included font licenses in `assets/fonts/`.

Retain vendor copyright and license notices when redistributing the template.
