<?php

it('returns a successful response', function () {
    $response = $this->get('/'.app()->getLocale());

    $response->assertStatus(200);
});
