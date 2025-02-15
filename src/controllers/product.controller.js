const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const productController = {
    // Create a new product
    create: async (req, res) => {
        try {
            const data = req.body;
            let result;

            if (Array.isArray(data)) {
                // Bulk create
                result = await prisma.$transaction(
                    data.map((product) =>
                        prisma.product.create({
                            data: {
                                product_name: product.product_name,
                                quantity: product.quantity,
                                price: product.price,
                                sale_price: product.sale_price,
                                category_id: product.category_id,
                                unit_id: product.unit_id
                            },
                            include: {
                                category: true,
                                unit: true
                            }
                        })
                    )
                );
            } else {
                // Single create
                result = await prisma.product.create({
                    data: {
                        product_name: data.product_name,
                        quantity: data.quantity,
                        price: data.price,
                        sale_price: data.sale_price,
                        category_id: data.category_id,
                        unit_id: data.unit_id
                    },
                    include: {
                        category: true,
                        unit: true
                    }
                });
            }

            res.status(201).json({
                message: 'Product created successfully',
                result: result
            });
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: 'Error creating product' });
        }
    },

    // Get all products with timestamps
    getAll: async (req, res) => {
        try {
            const products = await prisma.product.findMany({
                include: {
                    category: true,
                    unit: true,
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            });
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching products' });
        }
    },

    // Get a single product by ID
    getOne: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await prisma.product.findUnique({
                where: {
                    product_id: Number(id)
                },
                include: {
                    category: true,
                    unit: true
                }
            });

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json(product);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching product' });
        }
    },

    // Update a product
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { product_name, quantity, price, sale_price, category_id, unit_id } = req.body;

            const product = await prisma.product.update({
                where: {
                    product_id: Number(id)
                },
                data: {
                    product_name,
                    quantity,
                    price,
                    sale_price,
                    category_id,
                    unit_id
                    // updatedAt will be automatically handled by Prisma
                },
                include: {
                    category: true,
                    unit: true
                }
            });

            res.json(product);
        } catch (error) {
            res.status(500).json({ error: 'Error updating product' });
        }
    },

    // Delete a product
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.product.delete({
                where: {
                    product_id: Number(id)
                }
            });
            res.status(200).send({
                message: 'Product deleted successfully'
            });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting product' });
        }
    }
};

module.exports = productController;
