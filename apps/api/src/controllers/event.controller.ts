export class EventController {
  async createEvent(req: Request, res: Response) {
    const { name, description, date } = req.body;
  }
}
