package com.rdplatforms.backend.content;

/** Implemented by every entity whose full record is stored as JSON in {@code data}. */
public interface HasJsonData {
    String getData();
}
