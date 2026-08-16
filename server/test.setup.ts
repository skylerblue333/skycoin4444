// Test-only import boundary: no connection is opened by the tests unless a test explicitly performs a query.
process.env.DATABASE_URL ??= "mysql://test-only-import-boundary@127.0.0.1:3306/test_only";
