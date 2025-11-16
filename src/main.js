import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


let time = 0;

// Gestion du menu burger et des popups
document.addEventListener('DOMContentLoaded', () => {
  // Éléments du menu burger
  const menuToggle = document.getElementById('menuToggle');
  const sidePanel = document.getElementById('sidePanel');

  // Gestion du clic sur le menu burger
  if (menuToggle && sidePanel) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();

      // Basculer les classes pour l'animation
      const isActive = menuToggle.classList.toggle('active');
      sidePanel.classList.toggle('active');

      // Empêcher le défilement de la page lorsque le menu est ouvert
      if (isActive) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', function(e) {
      if (sidePanel.classList.contains('active') &&
          !e.target.closest('.side-panel') &&
          !e.target.closest('.menu-toggle')) {
        menuToggle.classList.remove('active');
        sidePanel.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Fermer le menu avec la touche Échap
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sidePanel.classList.contains('active')) {
        menuToggle.classList.remove('active');
        sidePanel.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  // Gestion du clic sur le branding
  const branding = document.getElementById('branding');
  if (branding) {
    branding.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Afficher le popup "À propos de moi" (popupRocket)
      const popup = document.getElementById('popupRocket');
      if (popup) {
        // Fermer tous les autres popups d'abord
        document.querySelectorAll('.popup').forEach(p => {
          if (p !== popup && p.classList.contains('active')) {
            p.classList.remove('active');
            p.setAttribute('aria-hidden', 'true');
          }
        });
        
        // Afficher le popup
        popup.classList.add('active');
        popup.setAttribute('aria-hidden', 'false');
        document.body.classList.add('popup-visible');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Gestion des boutons d'ouverture de popup
  document.querySelectorAll('[data-popup]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const popupId = button.getAttribute('data-popup');
      const popup = document.getElementById(popupId);
      
      if (popup) {
        // Cacher tous les autres popups
        document.querySelectorAll('.popup').forEach(p => {
          if (p !== popup) {
            p.classList.remove('active', 'show');
            p.style.display = 'none';
            p.setAttribute('aria-hidden', 'true');
          }
        });
        
        // Afficher le popup
        popup.style.display = 'flex';
        popup.style.opacity = '0';
        popup.offsetHeight; // Force reflow
        popup.classList.add('show');
        popup.style.opacity = '1';
        popup.setAttribute('aria-hidden', 'false');
        popup.focus();
        
        // Empêcher le défilement de la page
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Gestion des boutons de fermeture de popup
  document.querySelectorAll('.popup-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const popup = btn.closest('.popup');
      if (popup) {
        popup.classList.remove('active', 'show');
        popup.style.display = 'none';
        popup.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  });
  
  // Fermer les popups avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activePopup = document.querySelector('.popup.active, .popup.show');
      if (activePopup) {
        activePopup.classList.remove('active', 'show');
        activePopup.style.display = 'none';
        activePopup.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Initialisation du canvas
  const canvas = document.getElementById('canvas');
  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }

    // Create scene
    const scene = new THREE.Scene();

    // Skybox avec fichiers nommés xpos/xneg, ypos/yneg, zpos/zneg
    const cubeTexLoader = new THREE.CubeTextureLoader();
    cubeTexLoader.setPath('/skybox/'); // dossier sous vite/public/ -> servi à /skybox/
    const spaceCubeTex = cubeTexLoader.load(
        [
            'xpos.png', // +X (droite)
            'xneg.png', // -X (gauche)
            'ypos.png', // +Y (haut)
            'yneg.png', // -Y (bas)
            'zpos.png', // +Z (avant)
            'zneg.png'  // -Z (arrière)
        ],
        () => console.log('CubeMap chargé depuis skybox/'),
        undefined,
        (err) => console.error('Echec de chargement CubeMap', err)
    );

    // Les PNG de fond sont en sRGB
    spaceCubeTex.colorSpace = THREE.SRGBColorSpace;

    scene.background = spaceCubeTex;
    scene.environment = spaceCubeTex;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Add objects
    const geometry = new THREE.DodecahedronGeometry(1, 0);
    const material = new THREE.MeshLambertMaterial({
        color: '#468585',
        emissive: '#468585',
        flatShading: true
    });
    const dodecahedron = new THREE.Mesh(geometry, material);

    const boxGeometry = new THREE.BoxGeometry(2, 0.1, 2);
    const boxMaterial = new THREE.MeshStandardMaterial({
        color: '#B4B4B3',
        emissive: '#B4B4B3'
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.y = -1.5;
    box.scale.set(4, 1.5, 1);

    const groupPlanet = new THREE.Group();
    let factory, sport, rocket, cinema; // Déclarer les variables pour les objets
    let factoryInitialPosition, sportInitialPosition, rocketInitialPosition, cinemaInitialPosition; // Stocker les positions initiales

    const loader = new GLTFLoader();
    loader.load(
        '/models/planet1.glb', // Assurez-vous que ce nom existe bien (listé dans vite/models)
        (gltf) => {
            const planet = gltf.scene;
            planet.scale.set(1.5, 1.5, 1.5);  // Mise à jour de l'échelle à 2

            // Ajouter la planète au groupe
            groupPlanet.add(planet);
            console.log('Modèle chargé avec succès!', { url: '/models/planet1.glb' });

            // Charger la texture depuis /public/models puis l'appliquer
            const texLoader = new THREE.TextureLoader();
            texLoader.load(
                '/models/D1.png',
                (planetTex) => {
                    // Réglages texture pour rendu glTF correct
                    planetTex.colorSpace = THREE.SRGBColorSpace;
                    planetTex.flipY = false;
                    const maxAniso = (renderer.capabilities.getMaxAnisotropy && renderer.capabilities.getMaxAnisotropy()) || 8;
                    planetTex.anisotropy = Math.min(8, maxAniso);

                    let meshCount = 0;
                    let replacedCount = 0;
                    planet.traverse((node) => {
                        if (node.isMesh) {
                            meshCount++;
                            // Remplace le matériau par un standard PBR avec la texture de base
                            const newMat = new THREE.MeshStandardMaterial({ map: planetTex, color: 0xffffff, roughness: 0.9, metalness: 0.0 });
                            if (Array.isArray(node.material)) {
                                node.material = node.material.map(() => newMat.clone());
                                node.material.forEach((m) => m.needsUpdate = true);
                            } else {
                                node.material = newMat;
                                node.material.needsUpdate = true;
                            }
                            replacedCount++;
                        }
                    });
                    console.log(`D1.png appliquée. Meshs: ${meshCount}, matériaux remplacés: ${replacedCount}`);
                },
                undefined,
                (err) => console.error('Echec chargement texture D1.png', err)
            );
        },
        undefined,
        (error) => {
            console.error('Erreur lors du chargement du modèle:', error);
        }
    );

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Lumière directionnelle principale (comme le soleil)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Lumière d'appoint pour éclairer les parties sombres
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // Lumière ponctuelle pour ajouter du relief
    const pointLight = new THREE.PointLight(0xffffff, 2, 10);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    // Lumière hémisphérique pour un éclairage global doux
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemiLight.position.set(0, 5, 0);
    scene.add(hemiLight);

    // Add objects to scene
    //scene.add(dodecahedron);
    //scene.add(box);
    scene.add(groupPlanet);
    groupPlanet.scale.set(2, 2, 2); // Agrandir le groupe

    // Charger le modèle d'usine
    loader.load(
        '/models/vase.glb',
        (gltf) => {
            factory = gltf.scene; // Assigner l'objet chargé
            factory.name = 'factory'; // Nommage de l'objet
            
            // Calculer la boîte englobante pour obtenir la taille du modèle
            const box = new THREE.Box3().setFromObject(factory);
            const size = box.getSize(new THREE.Vector3());
            
            // Ajuster l'échelle pour que le modèle soit plus grand
            const targetSize = 0.7; // Taille cible augmentée
            const scale = targetSize / Math.max(size.x, size.y, 3.5);
            factory.scale.set(scale, scale, scale);
            
            // Ajuster la position en fonction de la nouvelle échelle
            factory.position.set(0, 1.0, 0);
            factoryInitialPosition = factory.position.clone();
            
            // Ajouter à la scène
            groupPlanet.add(factory);
            
            // Mise à jour de la boîte englobante après l'ajout à la scène
            factory.updateMatrixWorld();
            console.log('Modèle d\'usine chargé avec succès!');
        },
        undefined,
        (error) => console.error('Erreur de chargement du modèle d\'usine:', error)
    );

    loader.load(
        '/models/cinema.glb',
        (gltf) => {
            cinema = gltf.scene; // Assigner l'objet chargé
            cinema.name = 'cinemacinema'; // Nommage de l'objet
            cinema.scale.set(0.1, 0.1, 0.1);  // Échelle de 0.5
            cinema.position.set(0, 1.0, 0);   // Position en haut de la planète
            cinemaInitialPosition = cinema.position.clone(); // Sauvegarder la position initiale
            console.log('Modèle d\'usine chargé avec succès!');
        },
        undefined,
        (error) => console.error('Erreur de chargement du modèle d\'usine:', error)
    );

    // Création du groupe webdesign
    const webdesignGroup = new THREE.Group();
    
    // Configuration du groupe webdesign
    webdesignGroup.name = 'webdesign';
    webdesignGroup.scale.set(0.3, 0.3, 0.3);
    webdesignGroup.position.set(0, -1, 0);
    webdesignGroup.rotation.set(0, 0, -Math.PI);
    
    // Activer les interactions pour tous les enfants
    webdesignGroup.traverse(child => {
        if (child.isMesh) {
            child.userData.isInteractive = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    
    // Ajout du groupe à la scène principale
    groupPlanet.add(webdesignGroup);
    
    // Chargement des modèles web
    (() => {
            
            // Charger le modèle HTML
            loader.load(
                '/models/html.glb',
                (htmlModel) => {
                    const html = htmlModel.scene;
                    html.name = 'html';
                    
                    // Créer un groupe parent pour la rotation autour du centre
                    const htmlGroup = new THREE.Group();
                    htmlGroup.name = 'htmlGroup';
                    
                    // Ajuster l'échelle du modèle
                    html.scale.set(0.06, 0.06, 0.06);
                    
                    // Calculer la boîte englobante pour centrer le modèle
                    const box = new THREE.Box3().setFromObject(html);
                    const center = new THREE.Vector3();
                    box.getCenter(center);
                    
                    // Déplacer le modèle pour que son centre soit à l'origine du groupe
                    html.position.sub(center);
                    
                    // Ajouter le modèle au groupe
                    htmlGroup.add(html);
                    
                    // Positionner le groupe
                    htmlGroup.position.set(0.8, 1.3, 0);
                    
                    // Appliquer la rotation initiale au groupe
                    const initialRotation = -Math.PI/5;
                    htmlGroup.rotation.set(0, 0, initialRotation);
                    
                    // Sauvegarder les valeurs d'origine pour l'animation
                    htmlGroup.userData = {
                        originalY: htmlGroup.position.y,
                        originalRotation: initialRotation,
                        speed: 1.5,
                        amplitude: 0.1
                    };
                    
                    webdesignGroup.add(htmlGroup);
                },
                undefined,
                (error) => console.error('Erreur de chargement du modèle HTML:', error)
            );

            // Charger le modèle CSS
            loader.load(
                '/models/css.glb',
                (cssModel) => {
                    const css = cssModel.scene;
                    css.name = 'css';
                    
                    // Créer un groupe parent pour la rotation autour du centre
                    const cssGroup = new THREE.Group();
                    cssGroup.name = 'cssGroup';
                    
                    // Ajuster l'échelle et la position du modèle
                    css.scale.set(0.06, 0.06, 0.06);
                    
                    // Calculer la boîte englobante pour centrer le modèle
                    const box = new THREE.Box3().setFromObject(css);
                    const center = new THREE.Vector3();
                    box.getCenter(center);
                    
                    // Déplacer le modèle pour que son centre soit à l'origine du groupe
                    css.position.sub(center);
                    
                    // Ajouter le modèle au groupe
                    cssGroup.add(css);
                    
                    // Positionner le groupe
                    cssGroup.position.set(-0.8, 1.2, 0);
                    
                    // Appliquer la rotation initiale au groupe
                    const initialRotation = Math.PI/5;
                    cssGroup.rotation.set(0, 0, initialRotation);
                    
                    // Sauvegarder les valeurs d'origine pour l'animation
                    cssGroup.userData = {
                        originalY: cssGroup.position.y,
                        originalRotation: initialRotation,
                        speed: 1.8,
                        amplitude: 0.12
                    };
                    
                    webdesignGroup.add(cssGroup);
                },
                undefined,
                (error) => console.error('Erreur de chargement du modèle CSS:', error)
            );

            // Charger le modèle PC
            loader.load(
                '/models/pc.glb',
                (pcModel) => {
                    const pc = pcModel.scene;
                    pc.name = 'pc';
                    pc.scale.set(0.03, 0.03, 0.03); // Taille ajustée à 0.07
                    pc.position.set(0, 0, 0);

                    webdesignGroup.add(pc);
                    
                    // Animation de rebond
                    pc.userData = { 
                        originalY: pc.position.y,
                        bounceHeight: 0.2,  // Hauteur du rebond
                        bounceSpeed: 1.5,   // Vitesse du rebond
                        rotationSpeed: 0.5, // Vitesse de rotation
                        timeOffset: Math.random() * Math.PI * 2  // Désynchronisation des animations
                    };
                    
                    // Ajout du PC au groupe webdesign
                    webdesignGroup.add(pc);
                },
                undefined,
                (error) => console.error('Erreur de chargement du modèle PC:', error)
            );

    })(); // Fin du chargement des modèles web
    // Variables pour l'animation du graphisme
    let graphisme;
    const graphismeAnimation = {
        startY: 0,
        floatAmplitude: 0.15,  // Flottement plus prononcé
        floatSpeed: 2.0,      // Animation plus rapide
        rotationSpeed: 0.6,   // Rotation plus fluide
        offsetZ: -1.2,        // Position sur l'axe Z

        baseRotation: 0       // Rotation de base
    };

    // Charger le modèle graphisme
    loader.load(
        '/models/graphisme.glb',
        (gltf) => {
            graphisme = gltf.scene;
            graphisme.name = 'graphisme';
            graphismeAnimation.startY = graphisme.position.y; // Enregistrer la position Y initiale

            // Ajuster l'échelle
            const scale = 0.1;
            graphisme.scale.set(scale, scale, scale);

            // Positionner le modèle
            graphisme.position.set(0, 0, graphismeAnimation.offsetZ);

            // Rotation initiale pour une meilleure orientation
            graphisme.rotation.set(-Math.PI/2, 0, 0);

            // Sauvegarder la position Y initiale
            graphismeAnimation.startY = graphisme.position.y;

            // Activer les interactions et les ombres
            graphisme.traverse(child => {
                if (child.isMesh) {
                    child.userData.isInteractive = true;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Ajouter à la scène
            groupPlanet.add(graphisme);
            console.log('Modèle graphisme chargé avec succès!');
        },
        undefined,
        (error) => {
            console.error('Erreur lors du chargement du modèle graphisme:', error);
        }
    );

    // Charger le modèle sport séparément
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/models/TEXTURE/TextureSport.png', (texture) => {
        texture.encoding = THREE.sRGBEncoding;
        texture.flipY = false;

        loader.load(
            '/models/sport.glb',
            (gltf) => {
                sport = gltf.scene;
                sport.name = 'sport';

                // Configuration du modèle sport
                sport.scale.set(0.12, 0.12, 0.12);
                sport.position.set(0.83, 0, 0);
                sport.rotateZ(-Math.PI/2);
                sportInitialPosition = sport.position.clone();

                groupPlanet.add(sport);
                console.log('Modèle sport chargé avec succès!');
            },
            undefined,
            (error) => console.error('Erreur de chargement du modèle sport:', error)
        );
    });

    // Charger le modèle de fusée (rocket)
    const rocketTextureLoader = new THREE.TextureLoader();
    const rocketTexture = rocketTextureLoader.load('/models/TEXTURE/TextureRocket.png', (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = false;
    });

    loader.load(
        '/models/rocket.glb',
        (gltf) => {
            rocket = gltf.scene;
            rocket.name = 'rocket';

            // Appliquer la texture
            rocket.traverse((child) => {
                if (child.isMesh && child.material) {
                    const newMat = new THREE.MeshStandardMaterial({ map: rocketTexture, color: 0xffffff, roughness: 0.9, metalness: 0.1 });
                    child.material = newMat;
                    child.material.needsUpdate = true;
                }
            });

            // Configuration du modèle
            rocket.scale.set(0.15, 0.15, 0.15); // Augmenter la taille
            rocket.position.set(1, 1, 1); // Positionner la fusée en dehors de la planète
            rocket.rotation.z = -Math.PI / 2; // Rotation sur l'axe Z de 90 degrés


            scene.add(rocket); // Ajouter la fusée à la scène principale
            console.log('Position de la fusée:', rocket.position);
            console.log('Position de la caméra:', camera.position);
            console.log('La fusée est dans la scène:', scene.getObjectByName('rocket') !== undefined);
            console.log('Modèle fusée avec texture chargé avec succès!');
        },
        undefined,
        (error) => console.error('Erreur de chargement du modèle fusée:', error)
    );

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;

    // Raycaster pour détecter le clic sur un objet
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Gestion des popups
    const popup1 = document.getElementById('popup1');
    const popup2 = document.getElementById('popup2');
    const popupRocket = document.getElementById('popupRocket');
    const popupFactory = document.getElementById('popup-factory'); // Référence au popup de l'usine
    const popupwebdesign = document.getElementById('popupwebdesign'); // Référence au popup webdesign
    const popupGraphisme = document.getElementById('popupGraphisme'); // Référence au popup graphisme
    const branding = document.getElementById('branding');
    const popupCloseBtns = document.querySelectorAll('.popup-close');

    // Vérification des popups
    console.log('Popup Factory:', popupFactory ? 'Trouvé' : 'Non trouvé');
    console.log('Popup Webdesign:', popupwebdesign ? 'Trouvé' : 'Non trouvé');

    // Fonction pour afficher un popup spécifique
    function showPopup(popup) {
        console.log('Début de showPopup');
        if (!popup) {
            console.error('Aucun popup fourni à la fonction showPopup');
            return;
        }

        console.log('Affichage du popup:', popup.id);

        // Masquer tous les autres popups
        document.querySelectorAll('.popup').forEach(p => {
            if (p !== popup) {
                p.classList.remove('show');
                p.style.display = 'none';
                p.setAttribute('aria-hidden', 'true');
            }
        });

        // Afficher le popup demandé
        if (branding) {
            branding.style.display = 'none';
        }

        // S'assurer que le popup est visible avant l'animation
        popup.style.display = 'flex';
        popup.style.opacity = '0';

        // Forcer le recalcul du style pour l'animation
        void popup.offsetHeight;

        // Ajouter la classe show pour déclencher l'animation
        popup.classList.add('show');
        popup.style.opacity = '1';
        popup.setAttribute('aria-hidden', 'false');

        // Mettre le focus sur le popup pour l'accessibilité
        popup.focus();

        // Empêcher le défilement de la page
        document.body.style.overflow = 'hidden';

        // Ajouter un écouteur pour la touche Echap
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                hidePopup(popup);
                document.removeEventListener('keydown', handleKeyDown);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Retourner false pour empêcher le comportement par défaut
        return false;
    }

    // Fonction pour masquer un popup spécifique
    function hidePopup(popup, event) {
        if (!popup) {
            console.error('Aucun popup fourni à la fonction hidePopup');
            return;
        }

        console.log('Masquage du popup:', popup.id);

        // Ne pas fermer le popup si on clique sur le menu
        if (event) {
            const menuToggle = document.getElementById('menuToggle');
            const sidePanel = document.getElementById('sidePanel');

            if ((menuToggle && menuToggle.contains(event.target)) ||
                (sidePanel && sidePanel.contains(event.target))) {
                console.log('Clic sur le menu détecté, annulation de la fermeture du popup');
                return;
            }
        }

        // Retirer la classe show pour déclencher l'animation de fermeture
        popup.classList.remove('show', 'active');
        popup.setAttribute('aria-hidden', 'true');

        // Laisser l'animation se terminer avant de masquer complètement
        setTimeout(() => {
            if (!popup.classList.contains('show') && !popup.classList.contains('active')) {
                popup.style.display = 'none';

                // Vérifier si d'autres popups sont encore ouverts
                const anyPopupVisible = document.querySelector('.popup.show, .popup.active');
                if (!anyPopupVisible) {
                    document.body.classList.remove('popup-visible');
                    document.body.style.overflow = 'auto';

                    if (branding) {
                        branding.style.display = 'block';
                    }
                    document.body.style.overflow = ''; // Rétablir le défilement
                }
            }
        }, 400); // Correspond à la durée de la transition CSS
    }

    // Ajout des écouteurs d'événements pour les boutons de fermeture
    popupCloseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const popup = e.target.closest('.popup');
            hidePopup(popup, e);
        });
    });

    // Fermer le popup en cliquant en dehors du contenu
    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                hidePopup(popup, e);
            }
        });
    });

    // Fonction utilitaire pour la gestion des événements de souris
    function setMouseFromEvent(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    // Gestion du curseur au survol des objets
    renderer.domElement.addEventListener('mousemove', (event) => {
        setMouseFromEvent(event);
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);

        // Réinitialiser le curseur par défaut
        renderer.domElement.classList.remove('interactive-cursor');

        // Vérifier si on survole un objet interactif
        const isHoveringInteractive = intersects.some(intersect => {
            let obj = intersect.object;
            while (obj && obj !== scene && obj !== groupPlanet) {
                const name = obj.name ? obj.name.toLowerCase() : '';
                if (name.includes('factory') || name.includes('sport') ||
                    name.includes('rocket') || name.includes('cinema') ||
                    name.includes('webdesign') || name.includes('graphisme')) {
                    return true;
                }
                obj = obj.parent;
            }
            return false;
        });

        // Appliquer le curseur personnalisé si nécessaire
        if (isHoveringInteractive) {
            renderer.domElement.classList.add('interactive-cursor');
        }
    });

    const cinemaTextureLoader = new THREE.TextureLoader();
    const cinemaTexture = cinemaTextureLoader.load('/models/TEXTURE/textureCinema.png', (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = false;
    });

    loader.load(
        '/models/cinema.glb',
        (gltf) => {
            cinema = gltf.scene;
            cinema.name = 'cinema';

            // Appliquer la texture
            cinema.traverse((child) => {
                if (child.isMesh && child.material) {
                    const newMat = new THREE.MeshStandardMaterial({ map: cinemaTexture, color: 0xffffff, roughness: 0.9, metalness: 0.1 });
                    child.material = newMat;
                    child.material.needsUpdate = true;
                }
            });

            // Configuration du modèle
            cinema.scale.set(0.03, 0.03, 0.03);
            cinema.position.set(-0.95, 0, 0); // Positionner sur le côté droit de la planète

            cinema.rotateZ(Math.PI/2);

            groupPlanet.add(cinema); // Ajouter au groupe de la planète
            console.log('Modèle cinéma avec texture chargé avec succès!');
        },
        undefined,
        (error) => console.error('Erreur de chargement du modèle cinéma:', error)
    );

    // Clic pour ouvrir si on touche un objet
    renderer.domElement.addEventListener('click', (event) => {
        setMouseFromEvent(event);
        raycaster.setFromCamera(mouse, camera);

        // Obtenir tous les objets intersectés - inclure les enfants de manière récursive
        const intersects = raycaster.intersectObjects(scene.children, true);

        // Log pour déboguer
        console.log('=== CLIC DÉTECTÉ ===');
        console.log('Objets intersectés:', intersects.length);

        // Afficher les noms des objets et de leurs parents
        intersects.forEach((intersect, index) => {
            console.log(`Intersection ${index + 1}:`);
            console.log('- Objet:', intersect.object.name);
            console.log('- Parent:', intersect.object.parent ? intersect.object.parent.name : 'Aucun parent');
            console.log('---');
        });

        // Afficher les noms des objets et de leurs parents
        intersects.forEach(intersect => {
            console.log('Objet:', intersect.object.name, '| Parent:',
                       intersect.object.parent ? intersect.object.parent.name : 'Pas de parent');
        });

        // Vérifier si on a cliqué sur un objet qui n'est pas la planète
        const clickedObject = intersects.find(intersect => {
            let obj = intersect.object;

            // Remonter la hiérarchie des parents
            while (obj) {
                const name = obj.name ? obj.name.toLowerCase() : '';
                const parent = obj.parent;
                const parentName = parent ? (parent.name ? parent.name.toLowerCase() : '') : '';

                // Vérifier si l'objet ou son parent correspond à un élément interactif
                if (name.includes('factory') || name.includes('sport') ||
                    name.includes('rocket') || name.includes('cinema') ||
                    name.includes('webdesign') || name.includes('graphisme') ||
                    parentName.includes('factory') || parentName.includes('sport') ||
                    parentName.includes('rocket') || parentName.includes('cinema') ||
                    parentName.includes('webdesign') || parentName.includes('graphisme')) {
                    return true;
                }

                // Si on atteint la scène ou le groupe planète, on arrête
                if (parent === scene || parent === groupPlanet) {
                    break;
                }

                obj = parent;
            }

            return false;
        });

        console.log('Objet cliqué:', clickedObject); // Log pour voir l'objet qui a été sélectionné

        if (clickedObject) {
            const elementName = getClickedElementName(clickedObject.object);

            console.log('Élément cliqué:', elementName);

            // Afficher le bon popup en fonction de l'élément cliqué
            switch (elementName) {
                case 'factory':
                    console.log('Ouverture du popup factory');
                    showPopup(popup2);
                    break;
                case 'sport':
                    console.log('Ouverture du popup sport');
                    showPopup(popup1);
                    break;
                case 'rocket':
                    console.log('Ouverture du popup rocket');
                    showPopup(popupRocket);
                    break;
                case 'cinema':
                    console.log('Ouverture du popup cinema');
                    showPopup(popupCinema);
                    break;
                case 'webdesign':
                    console.log('Ouverture du popup webdesign');
                    showPopup(popupwebdesign);
                    break;
                case 'graphisme':
                    console.log('Ouverture du popup graphisme');
                    showPopup(popupGraphisme);
                    break;
                default:
                    console.log('Aucun objet valide cliqué');
            }
        } else {
            console.log('Aucun objet valide cliqué');
        }
    });

    // Fonction pour trouver le nom de l'élément cliqué ou de son parent
    function getClickedElementName(obj) {
        console.log('Recherche du nom de l\'objet cliqué...');
        while (obj && obj !== scene && obj !== groupPlanet) {
            const name = obj.name ? obj.name.toLowerCase() : '';
            console.log('Objet trouvé avec le nom:', name);

            if (name.includes('factory')) return 'factory';
            if (name.includes('sport')) return 'sport';
            if (name.includes('rocket')) return 'rocket';
            if (name.includes('cinema')) return 'cinema';
            if (name.includes('webdesign')) return 'webdesign';
            if (name.includes('graphisme')) {
                console.log('Modèle graphisme détecté!');
                return 'graphisme';
            }

            obj = obj.parent;
            if (obj) console.log('Passage au parent:', obj.name || 'sans nom');
        }
        console.log('Aucun objet reconnu dans la hiérarchie');
        return '';
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    const clock = new THREE.Clock(); // Créer une horloge pour l'animation

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime(); // Temps écoulé

        // Animation des modèles
        const webdesignGroup = groupPlanet.getObjectByName('webdesign');
        if (webdesignGroup) {
            webdesignGroup.children.forEach(child => {
                // Animation des modèles HTML et CSS
                if (child.name === 'htmlGroup' || child.name === 'cssGroup') {
                    // Animation de flottement
                    const floatSpeed = 2;
                    const floatAmount = 0.05;
                    child.position.y = child.userData.originalY + Math.sin(elapsedTime * floatSpeed) * floatAmount;

                    // Rotation continue sur l'axe Y
                    const rotationSpeed = 0.3;
                    child.rotation.y = child.userData.originalRotation + (elapsedTime * rotationSpeed) % (Math.PI * 2);
                }
                // Animation du PC (rebond)
                else if (child.name === 'pc') {
                    const { originalY, bounceHeight, bounceSpeed, rotationSpeed, timeOffset } = child.userData;

                    // Animation de rebond avec une fonction de rebond plus dynamique
                    const bounce = Math.abs(Math.sin((elapsedTime + timeOffset) * bounceSpeed));
                    child.position.y = originalY + (bounce * bounceHeight);

                    // Légère rotation sur l'axe Y
                    child.rotation.y = (elapsedTime * rotationSpeed) % (Math.PI * 2);

                    // Légère inclinaison pendant le rebond
                    child.rotation.x = Math.sin((elapsedTime + timeOffset) * bounceSpeed * 2) * 0.1;
                }
            });
        }

        // Vitesse et amplitude de l'effet de scale
        const scaleSpeed = 8;

        // Effet de scale pour l'usine (factory)
        if (factory) {
            // Sauvegarder l'échelle de base si ce n'est pas déjà fait
            if (!factory.baseScale) {
                factory.baseScale = factory.scale.clone();
            }

            // Animation de hauteur subtile
            const heightVariation = Math.sin(elapsedTime * 5) * 0.1; // Variation de hauteur


            // Légère variation d'échelle en fonction de la hauteur
            const scaleVariation = 1 + heightVariation * 2; // Variation subtile d'échelle
            factory.scale.set(
                factory.baseScale.x ,
                factory.baseScale.y * scaleVariation,
                factory.baseScale.z
            );
        }

        // Animation de pulsation similaire au cinéma mais plus rapide
        if (sport) {
            const baseScale = 0.12;
            const scale = 1 + Math.sin(elapsedTime * 8) * 0.05; // Pulsation plus rapide et plus subtile
            sport.scale.set(
                baseScale,
                baseScale * scale,  // Seul l'axe Y varie
                baseScale
            );
            // Ajustement de la position pour que la base reste fixe
            if (!sport.originalY) sport.originalY = sport.position.y;
            sport.position.y = sport.originalY + ((scale - 1) * baseScale * 0.5);
        }

        if (cinema) {
            // Animation de pulsation uniquement sur l'axe Y (hauteur)
            const scale = 1 + Math.sin(elapsedTime * 6) * 0.1; // Amplitude de 10%
            cinema.scale.y = 0.03 * scale; // Applique uniquement sur l'axe Y
            cinema.scale.x = 0.03; // Maintient l'échelle X fixe
            cinema.scale.z = 0.03; // Maintient l'échelle Z fixe
        }

        // Orbite de la fusée autour de la planète
        if (rocket) {
            const orbitRadius = 4;
            const orbitSpeed = -0.1; // Vitesse et direction opposée (ralentie)
            rocket.position.x = Math.cos(elapsedTime * orbitSpeed) * orbitRadius;
            rocket.position.z = Math.sin(elapsedTime * orbitSpeed) * orbitRadius;

            // Orienter la fusée pour qu'elle regarde vers l'avant de son mouvement
            const angle = elapsedTime * orbitSpeed;
            rocket.rotation.y = -angle + Math.PI / 2; // L'angle de rotation est l'inverse de l'angle de l'orbite, avec un ajustement
        }

        // Animation du modèle graphisme avec effets avancés
        if (graphisme) {
            // Flottement plus dynamique avec double oscillation

            const float2 = Math.sin(elapsedTime * graphismeAnimation.floatSpeed * 0.7) * (graphismeAnimation.floatAmplitude * 0.3);


            // Rotation fluide avec variation subtile de vitesse
            graphismeAnimation.baseRotation += graphismeAnimation.rotationSpeed * 0.01;
            graphisme.rotation.y = graphismeAnimation.baseRotation;

            // Légère oscillation sur l'axe X pour plus de naturel

        }

        // Rotation de la planète
        if (groupPlanet) {
            groupPlanet.rotation.y += -0.0005;
            groupPlanet.rotation.x += -0.0005; // Ajout de la rotation sur l'axe Z
        }

        if (rocket) {

        }

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    planet.traverse((node) => {
        if (node.isMesh && node.geometry) {
            // Smoothing: recalcul des normales et désactiver le flat shading
            node.geometry.computeVertexNormals();
            if (node.material) {
                if (Array.isArray(node.material)) {
                    node.material.forEach(m => { m.flatShading = false; m.needsUpdate = true; });
                } else {
                    node.material.flatShading = false;
                    node.material.needsUpdate = true;
                }
            }
        }
    });
});
