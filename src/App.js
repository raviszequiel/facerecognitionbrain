import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';


import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

function App() {

    //---------------------------------------------------------------
    //Particle moduile related functions and variables
    //---------------------------------------------------------------
    const [init, setInit] = useState(false);

    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async (engine) => {
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        //await loadAll(engine);
        //await loadFull(engine);
        await loadSlim(engine);
        //await loadBasic(engine);
        }).then(() => {
        setInit(true);
        });
    }, []);

    const particlesLoaded = (container) => {
        console.log(container);
    };

    const options = useMemo(() => ({
        background: {
            color: {
                value: "#0d47a1",
            },
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
            },
            modes: {
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 200,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: "#ffffff",
            },
            links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: false,
                speed: 6,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                },
                value: 90,
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 5 },
            },
        },
        detectRetina: true,}), [], 
    );

    //---------------------------------------------------------------
    //Face Recognition related functions and variables
    //---------------------------------------------------------------
    
    // Your PAT (Personal Access Token) can be found in the Account's Security section
    const PAT = '4c440377f8704fe19eb871d17efd3315';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'blackravis';       
    const APP_ID = 'test';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
    // this.IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';

    const buildRequest = (imgUrl) => {
        
        const raw = JSON.stringify({
            "user_app_id": {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            "inputs": [
                {
                    "data": {
                        "image": {
                            "url": imgUrl
                        }
                    }
                }
            ]
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Key ' + PAT
            },
            body: raw
        };

        return requestOptions;
    }

    const [input, setInput] = useState('https://samples.clarifai.com/metro-north.jpg');
    const [imageUrl, setImageUrl] = useState('https://samples.clarifai.com/metro-north.jpg');
    const [box, setBox ] = useState({});
    const [route, setRoute ] = useState('signin');
    const [isSignedIn, setIsSignedIn ] = useState(false);

    const calculateFaceLocation = (resp) => {
        
        const clarifaiFace = resp.outputs[0].data.regions[0].region_info.bounding_box;
        console.log(clarifaiFace);
        const image = document.getElementById('input_image');
        const width = Number(image.width);
        const height = Number(image.height);
        console.log(width, height)
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - clarifaiFace.bottom_row * height
        }
    }

    const displayFaceBox = (box) => {
        console.log(box);
        setBox(box);
    }

    const onButtonSubmit = () => {
        console.log('click');
        setImageUrl(input);
        console.log(imageUrl);

        const requestOptions = buildRequest(input);
        console.log(requestOptions);
        
        // // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
        // // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
        // // this will default to the latest version_id
        // // const req = `https://api.clarifai.com/v2/models/${this.MODEL_ID}/versions/${this.MODEL_VERSION_ID}/outputs`;
        const req = `https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`;
        // // const req = "https://api.clarifai.com/v2/models/" + this.MODEL_ID + "/versions/" + this.MODEL_VERSION_ID + "/outputs";
        console.log(req);
    
        fetch(req, requestOptions)
            .then(response => response.json())
            .then(result => {
                displayFaceBox(calculateFaceLocation(result));
            })                
            .catch(error => console.log('error', error));
    }

    const onInputChange = (event) => {
        console.log(event.target.value);
        setInput(event.target.value); 
        // console.log(input);               
    }

    const onRouteChange = (route_status) => {
        if( route_status === 'signout') {
            setIsSignedIn(false);
        } else if (route_status === 'home') {
            setIsSignedIn(true);
        }
        
        setRoute(route_status);
    }

    if (init) {
        return (
            <div className="App">
                <Particles className='particles'
                    id="tsparticles"
                    particlesLoaded={particlesLoaded}
                    options={options}
                />
                <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn}/>
                { route === 'home'
                    ? <div>
                        <Logo />
                        <Rank />
                        <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit}/>
                        <FaceRecognition box={box} imageURL={imageUrl}/>
                    </div>
                    : (
                        route === "signin"
                        ? <Signin onRouteChange={onRouteChange}/>
                        : <Register onRouteChange={onRouteChange}/>
                    )
                }                    
            </div>)
    }
    
}


export default App;
