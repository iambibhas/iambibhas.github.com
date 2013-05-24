$(function() {
    $('#id_text').on('keyup', function(e) {
        var text = $('#id_text').val();

        // MD5
        var md5 = CryptoJS.MD5(text);
        $('#id_md5').val(md5);

        // SHA-1
        var sha1 = CryptoJS.SHA1(text);
        $('#id_sha1').val(sha1);

        // SHA-256
        var sha256 = CryptoJS.SHA256(text);
        $('#id_sha256').val(sha256);

        // SHA-512
        var sha512 = CryptoJS.SHA512(text);
        $('#id_sha512').val(sha512);

        // SHA-3
        var sha3_224 = CryptoJS.SHA3(text, {outputLength: 224});
        console.log(sha3_224);
        $('#id_sha3_224').val(sha3_224);
        var sha3_256 = CryptoJS.SHA3(text, {outputLength: 256});
        $('#id_sha3_256').val(sha3_256);
        var sha3_384 = CryptoJS.SHA3(text, {outputLength: 384});
        $('#id_sha3_384').val(sha3_384);
        var sha3_512 = CryptoJS.SHA3(text, {outputLength: 512});
        $('#id_sha3_512').val(sha3_512);

        // RIPEMD-160
        var ripemd160 = CryptoJS.RIPEMD160(text);
        $('#id_ripemd160').val(ripemd160);
    });
});
