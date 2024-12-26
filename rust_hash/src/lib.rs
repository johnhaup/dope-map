use wasm_bindgen::prelude::*;
use ahash::AHasher;
use std::hash::Hasher;
use serde::Serialize;
use serde_wasm_bindgen::from_value;

#[wasm_bindgen]
pub fn hash_js_object(js_value: &JsValue) -> Result<u64, JsValue> {
    let json_value: serde_json::Value = from_value(js_value.clone())
        .map_err(|e| JsValue::from_str(&format!("Failed to parse JS object: {}", e)))?;

    let json_string = serde_json::to_string(&json_value)
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))?;

    let mut hasher = AHasher::default();
    hasher.write(json_string.as_bytes());
    let hash = hasher.finish();

    Ok(hash)
}
