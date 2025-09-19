import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

interface LocationInputProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({ onLocationSelect }) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation Error",
        description: "Geolocation is not supported by your browser",
      });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        try {
          // Reverse geocode to get address
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          
          if (data.results && data.results[0]) {
            const address = data.results[0].formatted_address;
            setAddress(address);
            onLocationSelect({ lat, lng, address });
            toast({
              title: "Location Updated",
              description: "Your current location has been successfully tracked.",
            });
          } else {
            throw new Error('No results found');
          }
        } catch (error) {
          console.error('Error getting address:', error);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Failed to get your address. Please try again or enter manually.",
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = "Failed to get your location. ";
        switch(error.code) {
          case 1:
            errorMessage += "Please enable location permissions.";
            break;
          case 2:
            errorMessage += "Position unavailable. Check your GPS/network.";
            break;
          case 3:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "Please try again.";
        }
        toast({
          variant: "destructive",
          title: "Location Error",
          description: errorMessage,
        });
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleLocationSearch = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      // Geocode address to get coordinates
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        onLocationSelect({ lat, lng, address });
        toast({
          title: "Location Updated",
          description: "Location has been successfully updated.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "No location found for the entered address. Please try a different address.",
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
      toast({
        variant: "destructive",
        title: "Location Error",
        description: "Failed to search location. Please try again.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter location or use current location"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={getCurrentLocation}
          disabled={loading}
          variant="outline"
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <span>📍 Use My Location</span>
          )}
        </Button>
      </div>
      <Button
        onClick={handleLocationSearch}
        disabled={!address || loading}
        className="w-full"
      >
        Search Location
      </Button>
    </div>
  );
};