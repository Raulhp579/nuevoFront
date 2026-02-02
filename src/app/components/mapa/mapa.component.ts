import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private map: any;

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null; // Clean up reference
    }
  }

  private async initMap() {
    // Dynamically import Leaflet only in the browser
    const L = await import('leaflet');

    // Fix icon issues
    this.configurarIconos(L);

    // Initialize map
    this.map = L.map('map').setView([37.8802, -4.8041], 14);

    // Add tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Icono rojo para el destino (Medac)
    const redIcon = L.icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Medac Marker (Rojo)
    const medacMarker = L.marker([37.8802566, -4.8040947], { icon: redIcon }).bindPopup(
      '<b>Medac Arena</b><br>Córdoba',
    );
    medacMarker.addTo(this.map);

    // User Location (Azul / Default)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Check if map still exists (component might be destroyed)
          if (!this.map) return;

          const { latitude, longitude } = position.coords;

          // Marcador de tu ubicación actual (Icono por defecto - Azul)
          const miUbicacion = L.marker([latitude, longitude]).bindPopup('<b>¡Estás aquí!</b>');
          miUbicacion.addTo(this.map);

          // Opcional: centrar el mapa en tu ubicación
          // this.map.setView([latitude, longitude], 14);
        },
        (error) => {
          console.error('Error obteniendo la ubicación:', error);
        },
      );
    }
  }

  private configurarIconos(L: any) {
    const iconDefault = L.icon({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = iconDefault;
  }
}
