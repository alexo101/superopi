/*
  # Create Initial Database Schema

  1. New Tables
    - `users`
      - `id` (serial, primary key)
      - `email` (varchar(255), unique, not null) - User's email address
      - `username` (varchar(10), unique, not null) - User's display name
      - `password` (text, not null) - Hashed password
      - `created_at` (timestamp) - Account creation timestamp
    
    - `products`
      - `id` (serial, primary key)
      - `name` (text, not null) - Product name
      - `brand` (text, not null) - Product brand
      - `rating` (integer, not null) - Overall rating 0-10
      - `category_id` (integer, not null) - Category reference
      - `supermarket` (text, not null) - Store where product is available
      - `image_url` (text, not null) - URL to product image
      - `sweetness` (integer, default 0) - Sweetness rating 0-10
      - `saltiness` (integer, default 0) - Saltiness rating 0-10
      - `smell` (integer, default 0) - Smell rating 0-10
      - `effectiveness` (integer, default 0) - Effectiveness rating 0-10
      - `price` (decimal) - Product price
      - `user_id` (integer, foreign key) - Reference to user who added the product
      - `review_count` (integer, default 1) - Number of reviews
      - `created_at` (timestamp) - Product creation timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read all data
    - Add policies for authenticated users to insert/update their own data
    - Add policy for public read access to products
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  email varchar(255) NOT NULL UNIQUE,
  username varchar(10) NOT NULL UNIQUE,
  password text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  name text NOT NULL,
  brand text NOT NULL,
  rating integer NOT NULL,
  category_id integer NOT NULL,
  supermarket text NOT NULL,
  image_url text NOT NULL,
  sweetness integer NOT NULL DEFAULT 0,
  saltiness integer NOT NULL DEFAULT 0,
  smell integer NOT NULL DEFAULT 0,
  effectiveness integer NOT NULL DEFAULT 0,
  price decimal(10, 2),
  user_id integer REFERENCES users(id),
  review_count integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Products policies
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own products"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_user ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);