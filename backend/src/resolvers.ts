export default {
  Query: {
    hello(obj: any, { subject }: { subject: string }) {
      return `Hello, ${subject}! from Server`;
    },
    user(obj: any, { id }: {id: string}) {
      return `Hello, ${id}`;
    }
  }
};
