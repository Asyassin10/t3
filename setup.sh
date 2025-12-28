#!/bin/bash

# Navigate to t3_api directory and copy env_copy.txt to .env
cd t3_app/t3_api/
cp env_copy.txt .env

# Navigate back to the original directory
cd ..
cd ..

# Navigate to t3_system directory and copy env_copy.txt to .env
cd t3_system
cp env_copy.txt .env
