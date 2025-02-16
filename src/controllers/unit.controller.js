const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const unitController = {
  // Create a new unit
  create: async (req, res) => {
    try {
      const data = req.body;
      let result;
      if (Array.isArray(data)) {
        // Bulk create
        result = await prisma.$transaction(
          data.map((unit) => 
            prisma.unit.create({
              data: {
                unit_name: unit.unit_name
              }
            })
          )
        );
      } else {
        // Single create
        result = await prisma.unit.create({
          data: {
            unit_name: data.unit_name
          }
        });
      }

      res.status(201).json({
        message: 'Unit created successfully',
        result: result
      });
    } catch (error) {
      console.error('Error creating unit:', error);
      res.status(500).json({ error: 'Error creating unit' });
    }
  },

  // Get all units
  getAll: async (req, res) => {
    try {
      const units = await prisma.unit.findMany({
        orderBy: {
          updatedAt: 'desc'
        }
      });
      res.json(units);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching units' });
    }
  },

  // Get a single unit by ID
  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const unit = await prisma.unit.findUnique({
        where: {
          unit_id: Number(id),
        },
      });
      if (!unit) {
        return res.status(404).json({ error: 'Unit not found' });
      }
      res.json(unit);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching unit' });
    }
  },

  // Update a unit
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { unit_name } = req.body;
      const unit = await prisma.unit.update({
        where: {
          unit_id: Number(id),
        },
        data: {
          unit_name,
        },
      });
      res.json(unit);
    } catch (error) {
      res.status(500).json({ error: 'Error updating unit' });
    }
  },

  // Delete a unit
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.unit.delete({
        where: {
          unit_id: Number(id),
        },
      });

      res.status(200).send({
        message: 'Unit deleted successfully',
      });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting unit' });
    }
  },
};

module.exports = unitController;
