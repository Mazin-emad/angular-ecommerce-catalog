import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';

export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  isNew?: boolean;
  colors?: string[];
  category: string;
  description: string;
  gallery: string[];
  sizes?: string[];
  inStock: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly products = signal<ProductDetail[]>([
    {
      id: '1',
      name: 'HAVIT HV-G92 Gamepad',
      price: 120,
      originalPrice: 160,
      discount: 40,
      rating: 5,
      reviewCount: 88,
      image: 'images/products/HAVIT HV-G92 Gamepad.webp',
      category: 'Gaming',
      description: 'PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.',
      gallery: [
        'images/products/HAVIT HV-G92 Gamepad.webp',
        'images/product-details/Havic HV G-92 Gamepad.webp',
        'images/product-details/Havic HV G-92 Gamepad-2.webp',
        'images/product-details/Havic HV G-92 Gamepad-3.webp',
        'images/product-details/Havic HV G-92 Gamepad-4.webp',
        'images/product-details/Havic HV G-92 Gamepad-5.webp',
      ],
      colors: ['#0F0F0F', '#DB4444'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      inStock: true,
    },
    {
      id: '2',
      name: 'AK-900 Wired Keyboard',
      price: 960,
      originalPrice: 1160,
      discount: 35,
      rating: 4,
      reviewCount: 75,
      image: 'images/products/AK-900 Wired Keyboard.webp',
      category: 'Computers',
      description: 'Logitech G915 TKL is a high performance gaming keyboard with LIGHTSPEED wireless technology, low profile mechanical keys, and premium RGB lighting.',
      gallery: [
        'images/products/AK-900 Wired Keyboard.webp',
      ],
      colors: ['#0F0F0F', '#DB4444'],
      inStock: true,
    },
    {
      id: '3',
      name: 'IPS LCD Gaming Monitor',
      price: 370,
      originalPrice: 400,
      discount: 30,
      rating: 5,
      reviewCount: 99,
      image: 'images/products/IPS LCD Gaming Monitor.webp',
      category: 'Monitors',
      description: '27 inch WQHD 2560 x 1440 IPS gaming monitor with 1ms response time and 144Hz refresh rate for smooth gaming experience.',
      gallery: [
        'images/products/IPS LCD Gaming Monitor.webp',
      ],
      colors: ['#0F0F0F'],
      inStock: true,
    },
    {
      id: '4',
      name: 'S-Series Comfort Chair',
      price: 375,
      originalPrice: 400,
      discount: 25,
      rating: 5,
      reviewCount: 99,
      image: 'images/products/S-Series Comfort Chair.webp',
      category: 'Furniture',
      description: 'Ergonomic office chair with lumbar support, adjustable armrests, and breathable mesh back for all-day comfort.',
      gallery: [
        'images/products/S-Series Comfort Chair.webp',
      ],
      colors: ['#0F0F0F', '#DB4444', '#C0C0C0'],
      sizes: ['S', 'M', 'L'],
      inStock: true,
    },
    {
      id: '5',
      name: 'RGB liquid CPU Cooler',
      price: 160,
      originalPrice: 170,
      discount: 0,
      rating: 5,
      reviewCount: 65,
      image: 'images/products/RGB liquid CPU Cooler.webp',
      category: 'Computers',
      description: 'High-performance liquid CPU cooler with RGB lighting and 240mm radiator for efficient heat dissipation.',
      gallery: [
        'images/products/RGB liquid CPU Cooler.webp',
      ],
      colors: ['#0F0F0F'],
      inStock: true,
    },
    {
      id: '6',
      name: 'Small BookShelf',
      price: 250,
      originalPrice: 250,
      discount: 0,
      rating: 5,
      reviewCount: 44,
      image: 'images/products/Small BookSelf.webp',
      category: 'Furniture',
      description: 'Compact wooden bookshelf perfect for organizing books and decorative items in any room.',
      gallery: [
        'images/products/Small BookSelf.webp',
      ],
      colors: ['#8B4513'],
      inStock: true,
    },
    {
      id: '7',
      name: 'Breed Dry Dog Food',
      price: 100,
      originalPrice: 100,
      discount: 0,
      rating: 4,
      reviewCount: 35,
      image: 'images/products/Breed Dry Dog Food.webp',
      category: 'Pet Supplies',
      description: 'Premium dry dog food formulated for breed-specific nutrition with real meat as the first ingredient.',
      gallery: [
        'images/products/Breed Dry Dog Food.webp',
      ],
      inStock: true,
    },
    {
      id: '8',
      name: 'CANON EOS DSLR Camera',
      price: 360,
      originalPrice: 400,
      discount: 35,
      rating: 4,
      reviewCount: 95,
      image: 'images/products/CANON EOS DSLR Camera.webp',
      category: 'Cameras',
      description: '24.1MP APS-C CMOS sensor DSLR camera with 4K video recording and built-in Wi-Fi and Bluetooth.',
      gallery: [
        'images/products/CANON EOS DSLR Camera.webp',
      ],
      inStock: true,
    },
    {
      id: '9',
      name: 'ASUS FHD Gaming Laptop',
      price: 700,
      originalPrice: 800,
      discount: 35,
      rating: 5,
      reviewCount: 325,
      image: 'images/products/ASUS FHD Gaming Laptop.webp',
      category: 'Laptops',
      description: '15.6" FHD 144Hz gaming laptop with Intel Core i7, NVIDIA RTX 3060, 16GB RAM, and 512GB SSD.',
      gallery: [
        'images/products/ASUS FHD Gaming Laptop.webp',
      ],
      inStock: true,
    },
    {
      id: '10',
      name: 'Curology Product Set',
      price: 300,
      originalPrice: 350,
      discount: 0,
      rating: 5,
      reviewCount: 99,
      image: 'images/products/Curology Product Set .webp',
      category: 'Beauty',
      description: 'Custom skincare set with cleanser, moisturizer, and treatment serum for personalized skincare routine.',
      gallery: [
        'images/products/Curology Product Set .webp',
      ],
      inStock: true,
    },
    {
      id: '11',
      name: 'Kids Electric Car',
      price: 960,
      originalPrice: 1160,
      discount: 35,
      rating: 5,
      reviewCount: 65,
      image: 'images/products/Kids Electric Car.webp',
      category: 'Toys',
      description: 'Battery-powered ride-on electric car for kids with remote control, working headlights, and Bluetooth.',
      gallery: [
        'images/products/Kids Electric Car.webp',
      ],
      colors: ['#FF0000', '#0F0F0F', '#FFFFFF'],
      inStock: true,
    },
    {
      id: '12',
      name: 'Jr. Zoom Soccer Cleats',
      price: 1160,
      originalPrice: 1160,
      discount: 0,
      rating: 5,
      reviewCount: 35,
      image: 'images/products/Jr. Zoom Soccer Cleats.webp',
      category: 'Sports',
      description: 'Lightweight youth soccer cleats with textured upper for enhanced ball control and rubber studs for traction.',
      gallery: [
        'images/products/Jr. Zoom Soccer Cleats.webp',
      ],
      colors: ['#0F0F0F', '#FFFFFF'],
      sizes: ['3', '4', '5', '6', '7'],
      inStock: true,
    },
    {
      id: '13',
      name: 'GP11 Shooter USB Gamepad',
      price: 550,
      originalPrice: 550,
      discount: 0,
      rating: 5,
      reviewCount: 55,
      image: 'images/products/GP11 Shooter USB Gamepad.webp',
      category: 'Gaming',
      description: 'Ergonomic USB gamepad with dual vibration motors, programmable buttons, and compatible with PC and PS3.',
      gallery: [
        'images/products/GP11 Shooter USB Gamepad.webp',
      ],
      inStock: true,
    },
    {
      id: '14',
      name: 'Quilted Satin Jacket',
      price: 660,
      originalPrice: 660,
      discount: 0,
      rating: 5,
      reviewCount: 55,
      image: 'images/products/Quilted Satin Jacket.webp',
      category: 'Fashion',
      description: 'Premium quilted satin jacket with snap button closure, side pockets, and comfortable lining.',
      gallery: [
        'images/products/Quilted Satin Jacket.webp',
      ],
      colors: ['#0F0F0F', '#1E3A5F'],
      sizes: ['S', 'M', 'L', 'XL'],
      inStock: true,
    },
  ]);

  getProducts(): Observable<ProductDetail[]> {
    return of(this.products()).pipe(delay(200));
  }

  getProductById(id: string): Observable<ProductDetail | undefined> {
    return of(this.products().find(p => p.id === id)).pipe(delay(300));
  }

  getRelatedProducts(currentId: string, category: string, limit = 4): Observable<ProductDetail[]> {
    const related = this.products()
      .filter(p => p.id !== currentId && p.category === category)
      .slice(0, limit);

    if (related.length < limit) {
      const extra = this.products()
        .filter(p => p.id !== currentId && p.category !== category)
        .slice(0, limit - related.length);
      return of([...related, ...extra]).pipe(delay(200));
    }

    return of(related).pipe(delay(200));
  }
}
