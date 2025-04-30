import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import '../styles/Explore.css';
import '../styles/PageBackgrounds.css';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';

const center = { lat: 40.0583, lng: -74.4057 };

const TrailModal = ({ trail, onClose }) => {
  if (!trail) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          maxWidth: 700,
          width: '95%',
          padding: 32,
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 28,
            cursor: 'pointer'
          }}
        >&times;</button>
        <img
          src={trail.image}
          alt={trail.name}
          style={{
            width: '100%',
            maxWidth: 500,
            borderRadius: 12,
            marginBottom: 20,
            objectFit: 'cover'
          }}
        />
        <h2 style={{ margin: '0 0 16px 0', textAlign: 'center' }}>{trail.name}</h2>
        <p style={{
          fontSize: 16,
          lineHeight: 1.7,
          textAlign: 'left',
          margin: 0,
          whiteSpace: 'pre-line'
        }}>
          {trail.description}
        </p>
      </div>
    </div>
  );
};

const Explore = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [modalTrail, setModalTrail] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    // Initialize the map when the component mounts
    const initMap = async () => {
      // @ts-ignore
      const { Map } = await window.google.maps.importLibrary("maps");
      const mapInstance = new Map(document.getElementById("map"), {
        center: { lat: 40.0583, lng: -74.4057 },
        zoom: 8,
      });
      setMap(mapInstance);
    };

    // Check if google maps is loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      console.error('Google Maps not loaded');
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          setUserLocation(null);
        }
      );
    }
  }, []);

  function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
    function deg2rad(deg) {
      return deg * (Math.PI/180);
    }
    const R = 3958.8; // Radius of the earth in miles
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  const njTrails = [
    {
      id: 1,
      name: "Delaware Water Gap",
      image: "/images/delaware-water-gap.jpg",
      difficulty: "Moderate",
      length: "7.2 miles",
      location: "Warren County",
      lat: 40.9708,
      lng: -75.1423,
      description: "The Delaware Water Gap is a prominent geological feature where the Delaware River cuts through a large ridge of the Appalachian Mountains, forming a dramatic and scenic valley. This area is renowned for its breathtaking vistas, diverse wildlife, and lush forests. The Gap is a major destination for outdoor recreation, offering hiking, canoeing, fishing, and camping opportunities. The Appalachian Trail passes through the region, attracting long-distance hikers. Managed by the National Park Service, the Delaware Water Gap National Recreation Area preserves both natural beauty and cultural history. The area is rich in Native American and colonial heritage. Its unique geology and picturesque landscapes make it one of the most visited natural attractions in the eastern United States. The Water Gap is a symbol of the enduring power of natural forces."
    },
    {
      id: 2,
      name: "Buttermilk Falls",
      image: "/images/buttermilk-falls.jpg",
      difficulty: "Easy",
      length: "1.4 miles",
      location: "Sussex County",
      lat: 41.1802,
      lng: -74.8871,
          description: "Buttermilk Falls is the tallest waterfall in New Jersey, cascading nearly 200 feet in a series of picturesque drops. Located within the Delaware Water Gap National Recreation Area, the falls are easily accessible and popular among visitors. A steep trail leads from the base of the falls up to the Appalachian Trail, offering hikers a challenging climb and rewarding views. The surrounding forest is home to a variety of plant and animal species, making it a haven for nature lovers. The falls are especially impressive after heavy rains or during the spring thaw. Buttermilk Falls is a favorite spot for photographers and those seeking tranquility. The frothy, white water gives the falls their distinctive name. The site is a peaceful retreat into the heart of New Jersey's wild landscape."
    },
    {
      id: 3,
      name: "Mount Tammany",
      image: "/images/mount-tammany.jpg",
      difficulty: "Hard",
      length: "3.5 miles",
      location: "Warren County",
      lat: 40.9702,
      lng: -75.1236,
      description: "Mount Tammany is one of New Jersey's most popular hiking destinations, offering stunning views of the Delaware Water Gap from its summit. The mountain rises to 1,526 feet and is part of the Kittatinny Ridge. The Red Dot and Blue Dot trails provide challenging but rewarding routes to the top. Hikers are treated to panoramic vistas of the river, surrounding mountains, and forests. The area is rich in wildlife, including deer, black bears, and a variety of birds. Mount Tammany is a favorite for both experienced hikers and those seeking a memorable day trip. The mountain is named after the Lenape chief Tamanend. Its rugged beauty and dramatic scenery make it a must-visit for outdoor enthusiasts."
    },
    {
      id: 4,
      name: "Stairway to Heaven",
      image: "/images/stairway-to-heaven.jpg",
      difficulty: "Moderate",
      length: "2.9 miles",
      location: "Sussex County",
      lat: 41.1807,
      lng: -74.4807,
      description: "The Stairway to Heaven trail is a scenic hike located in Sussex County, New Jersey, known for its beautiful boardwalks, wildflower meadows, and rocky climbs. The trail culminates at Pinwheel Vista, offering breathtaking views of the Vernon Valley and beyond. The route is part of the Appalachian Trail and is accessible to hikers of varying skill levels. Along the way, visitors encounter wetlands, forests, and open fields teeming with wildlife. The boardwalk section is especially popular for its accessibility and picturesque setting. The final ascent to the vista is steep but manageable, rewarding hikers with one of the best views in the state. The trail is a favorite for both casual walkers and serious hikers. Its diverse landscapes and stunning outlooks make it a highlight of New Jersey hiking."
    },
    {
      id: 5,
      name: "Pyramid Mountain",
      image: "/images/pyramid-mountain.jpg",
      difficulty: "Moderate",
      length: "4.0 miles",
      location: "Morris County",
      lat: 40.9652,
      lng: -74.3821,
      description: "Pyramid Mountain Natural Historic Area is known for its unique glacial erratics, including the famous Tripod Rock, and its rugged, scenic trails. The area features a network of paths that wind through forests, wetlands, and rocky outcrops. Hikers can explore a variety of terrains and enjoy panoramic views from several high points. The park is rich in geological and ecological diversity, making it a popular destination for nature study. Pyramid Mountain is also home to a variety of wildlife, including deer, foxes, and numerous bird species. The area is managed by the Morris County Park Commission and offers educational programs and guided hikes. Its combination of natural beauty and geological wonders attracts visitors year-round. The park is a testament to the power of glaciers and the beauty of New Jersey's landscapes."
    },
    {
      id: 6,
      name: "Ramapo Valley County Reservation",
      image: "/images/ramapo-valley.jpg",
      difficulty: "Easy",
      length: "5.5 miles",
      location: "Bergen County",
      lat: 41.0772,
      lng: -74.1886,
          description: "Ramapo Valley County Reservation is Bergen County's largest park, offering over 4,000 acres of forests, streams, and scenic vistas. The park features a network of trails suitable for hiking, biking, and horseback riding. Ramapo Lake, a centerpiece of the reservation, is popular for fishing and kayaking. The area is home to a variety of wildlife, including turtles, deer, and numerous bird species. Several trails lead to panoramic viewpoints overlooking the Ramapo Mountains and surrounding valleys. The reservation is a favorite for both casual walkers and serious hikers. Its proximity to urban areas makes it a convenient escape into nature. The park's diverse habitats and recreational opportunities make it a gem of northern New Jersey."
    },
    {
      id: 7,
      name: "Watchung Reservation",
      image: "/images/watchung-reservation.jpg",
      difficulty: "Easy",
      length: "6.0 miles",
      location: "Union County",
      lat: 40.6721,
      lng: -74.4142,
      description: "Watchung Reservation is Union County's largest park, encompassing over 2,000 acres of woodlands, streams, and lakes. The reservation features a network of trails, including the popular Sierra Trail, which loops through diverse habitats. The area is rich in history, with sites such as the Deserted Village of Feltville and the Watchung Stables. The reservation is home to a variety of wildlife, including foxes, owls, and salamanders. Its forests and wetlands provide important habitats for native species. The park offers educational programs, picnic areas, and playgrounds, making it a family-friendly destination. Watchung Reservation is a green oasis in a densely populated region. Its natural beauty and historical significance make it a beloved local treasure."
    },
    {
      id: 8,
      name: "High Point State Park",
      image: "/images/high-point.jpg",
      difficulty: "Moderate",
      length: "3.0 miles",
      location: "Sussex County",
      lat: 41.3204,
      lng: -74.6612,
      description: "High Point State Park is located at the highest elevation in New Jersey, offering sweeping views of three states from its iconic monument. The park features over 50 miles of trails, including sections of the Appalachian Trail. Visitors can enjoy hiking, swimming, fishing, and camping in a pristine natural setting. The High Point Monument, a 220-foot obelisk, commemorates New Jersey's veterans and provides panoramic vistas. The park's diverse habitats support a variety of wildlife, including black bears, bobcats, and migratory birds. High Point is especially popular in the fall, when the forests are ablaze with color. The park is managed by the New Jersey Division of Parks and Forestry. Its combination of natural beauty and recreational opportunities makes it a top destination for outdoor enthusiasts."
    },
    {
      id: 9,
      name: "South Mountain Reservation",
      image: "/images/south-mountain.jpg",
      difficulty: "Moderate",
      length: "6.0 miles",
      location: "Essex County",
      lat: 40.7487,
      lng: -74.2982,
      description: "South Mountain Reservation is a 2,110-acre nature reserve located in Essex County, New Jersey. The reservation features a network of trails that wind through forests, along streams, and past waterfalls. The Rahway River flows through the park, creating scenic gorges and cascades. The reservation is home to the South Mountain Fairy Trail, a whimsical path decorated with fairy houses. The area offers picnic areas, playgrounds, and a dog park, making it a popular family destination. The reservation is managed by the Essex County Park System and is a vital green space in a densely populated region. Its diverse habitats support a variety of wildlife, including deer, foxes, and hawks. South Mountain Reservation is a beloved retreat for hikers, runners, and nature lovers."
    },
    {
      id: 10,
      name: "Hacklebarney State Park",
      image: "/images/hacklebarney.jpg",
      difficulty: "Easy",
      length: "3.5 miles",
      location: "Morris County",
      lat: 40.7793,
      lng: -74.7360,
        description: "Hacklebarney State Park is a scenic park located in Morris County, New Jersey, known for its rugged terrain and picturesque Black River. The park features a network of trails that wind through forests, along rocky streams, and past waterfalls. The area is popular for hiking, fishing, and picnicking. The park's diverse habitats support a variety of wildlife, including trout, deer, and songbirds. Hacklebarney is especially beautiful in the fall, when the forests are ablaze with color. The park is managed by the New Jersey Division of Parks and Forestry. Its combination of natural beauty and recreational opportunities makes it a favorite destination for families and outdoor enthusiasts. The park's tranquil setting offers a peaceful escape from urban life."
    },
    {
      id: 11,
      name: "Jenny Jump State Forest",
      image: "/images/jenny-jump.jpg",
      difficulty: "Moderate",
      length: "6.5 miles",
      location: "Warren County",
      lat: 40.9112,
      lng: -74.9118,
      description: "Jenny Jump State Forest is located in Warren County, New Jersey, and is known for its rugged terrain and scenic vistas. The forest features a network of trails that wind through hardwood forests, along ridges, and past glacial boulders. The park is named after a local legend involving a girl named Jenny who leapt to her death to escape a Native American attack. The area is popular for hiking, camping, and stargazing, with an observatory located within the park. The forest is home to a variety of wildlife, including black bears, foxes, and owls. Jenny Jump offers several scenic overlooks with views of the Kittatinny Mountains and the Delaware Water Gap. The park's diverse habitats support a rich array of plant and animal species. Jenny Jump State Forest is a hidden gem for nature lovers and adventurers."
    },
    {
      id: 12,
      name: "Norvin Green State Forest",
      image: "/images/norvin-green.jpg",
      difficulty: "Hard",
      length: "7.5 miles",
      location: "Passaic County",
      lat: 41.0782,
      lng: -74.3310,
       description: "Norvin Green State Forest is a rugged wilderness area located in Passaic County, New Jersey. The forest features over 20 miles of trails that wind through dense woodlands, past waterfalls, and up rocky ridges. The area is known for its challenging hikes and panoramic views of the Wanaque Reservoir and New York City skyline. Norvin Green is home to a variety of wildlife, including black bears, bobcats, and hawks. The forest's diverse habitats support a rich array of plant and animal species. The area is popular for hiking, birdwatching, and photography. Norvin Green is managed by the New Jersey Division of Parks and Forestry. Its wild beauty and remote feel make it a favorite for experienced hikers and outdoor enthusiasts."
    }
  ];

  const filteredTrails = njTrails.filter(trail =>
    trail.name.toLowerCase().includes(search.toLowerCase()) ||
    trail.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <>
      <TrailModal trail={modalTrail} onClose={() => setModalTrail(null)} />
    <div className="explore-container">
      <div className="explore-header">
        <h1>
          {user ? 'Ready for another hike? 🥾' : 'Welcome to TrailMixer! 🌲'}
        </h1>
        <p>
          {user
            ? 'Find a new trail to conquer today.'
            : 'Discover and track amazing hiking trails near you.'}
        </p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for trails by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '300px',
            borderRadius: '12px',
            marginTop: '2rem'
          }}
          center={userLocation || center}
          zoom={8}
        >
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              }}
              title="Your Location"
            />
          )}
          {njTrails.map(trail => (
            <Marker
              key={trail.id}
              position={{ lat: trail.lat, lng: trail.lng }}
              title={trail.name}
              onMouseOver={() => setActiveMarker(trail.id)}
              onMouseOut={() => setActiveMarker(null)}
            >
              {activeMarker === trail.id && (
                <InfoWindow
                  position={{ lat: trail.lat, lng: trail.lng }}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div style={{ maxWidth: 200 }}>
                    <img
                      src={trail.image}
                      alt={trail.name}
                      style={{ width: '100%', borderRadius: 8, marginBottom: 8 }}
                    />
                    <h3 style={{ margin: 0 }}>{trail.name}</h3>
                    <p style={{ margin: 0, fontSize: 14 }}>{trail.location}</p>
                    <div style={{ fontSize: 13, marginTop: 4 }}>
                      <span><b>Difficulty:</b> {trail.difficulty}</span><br />
                      <span><b>Length:</b> {trail.length}</span>
                      {userLocation && (
                        <>
                          <br />
                          <span>
                            <b>Distance:</b> {getDistanceFromLatLonInMiles(
                              userLocation.lat,
                              userLocation.lng,
                              trail.lat,
                              trail.lng
                            ).toFixed(1)} miles
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>

        <div className="trails-grid">
          {filteredTrails.map(trail => (
            <div key={trail.id} className="trail-card">
              <div className="trail-image" style={{backgroundImage: `url(${trail.image})`}}></div>
              <div className="trail-info">
                <h3
                  style={{ cursor: 'pointer', color: '#2e5339', textDecoration: 'underline' }}
                  onClick={() => setModalTrail(trail)}
                >
                  {trail.name}
                </h3>
                <p className="trail-location">{trail.location}</p>
                <div className="trail-details">
                  <span className={`difficulty ${trail.difficulty.toLowerCase()}`}>
                    {trail.difficulty}
                  </span>
                  <span className="length">{trail.length}</span>
                  {userLocation && (
                    <span className="distance">
                      {getDistanceFromLatLonInMiles(
                        userLocation.lat,
                        userLocation.lng,
                        trail.lat,
                        trail.lng
                      ).toFixed(1)} miles away
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredTrails.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 32, color: '#888' }}>
            No trails found.
          </div>
        )}
    </div>
    </>
  );
};

export default Explore;