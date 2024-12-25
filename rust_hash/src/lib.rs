use wasm_bindgen::prelude::*;
use ahash::AHasher;
use std::hash::{Hash, Hasher};

/// Hash a string using AHash and return the result as a hexadecimal string
#[wasm_bindgen]
pub fn hash_string(input: &str) -> String {
    let mut hasher = AHasher::default();
    input.hash(&mut hasher);
    format!("{:x}", hasher.finish())
}
